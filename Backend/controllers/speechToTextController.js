import fs from 'fs/promises';
import fsSync from 'fs';
import OpenAI, { toFile } from 'openai';
import path from 'path';
import os from 'os';
import { spawn, spawnSync, execFile } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import crypto from 'crypto';
import ffmpegStatic from 'ffmpeg-static';

const execFileAsync = promisify(execFile);

const CHUNK_SECONDS = 60;
const CHUNK_CONCURRENCY = 2;
const PROGRESS_TTL_MS = 10 * 60 * 1000;

const transcriptionProgress = new Map();

const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
        throw new Error('OpenAI API key not configured. Add OPENAI_API_KEY to Backend/.env and restart the server.');
    }
    return new OpenAI({
        apiKey,
        timeout: 180000,
        maxRetries: 0,
    });
};

const initJobProgress = (jobId) => {
    transcriptionProgress.set(jobId, {
        status: 'processing',
        currentChunk: 0,
        totalChunks: 0,
        percent: 0,
        message: 'Preparing audio...',
    });
    setTimeout(() => transcriptionProgress.delete(jobId), PROGRESS_TTL_MS);
};

const updateJobProgress = (jobId, updates) => {
    if (!jobId) return;
    const current = transcriptionProgress.get(jobId) || {};
    transcriptionProgress.set(jobId, { ...current, ...updates });
};

const completeJobProgress = (jobId, message = 'Transcription complete') => {
    updateJobProgress(jobId, { status: 'completed', percent: 100, message });
};

const failJobProgress = (jobId, message) => {
    updateJobProgress(jobId, { status: 'failed', message });
};

export const getExtractTextProgress = (req, res) => {
    const { jobId } = req.params;
    const progress = transcriptionProgress.get(jobId);

    if (!progress) {
        return res.status(404).send({
            success: false,
            message: 'Progress not found for this job',
        });
    }

    return res.status(200).send({
        success: true,
        progress,
    });
};
const PYTHON_COMMANDS = [
    ...(process.env.PYTHON_EXECUTABLE ? [[process.env.PYTHON_EXECUTABLE, []]] : []),
    ['python', []],
    ['py', ['-3']],
];

const runPythonScript = (scriptName, scriptArgs = []) => {
    const attempts = [];
    const cwd = process.cwd();

    for (const [command, commandArgs] of PYTHON_COMMANDS) {
        const result = spawnSync(
            command,
            [...commandArgs, scriptName, ...scriptArgs],
            {
                encoding: 'utf-8',
                cwd,
                env: {
                    ...process.env,
                    PYTHONIOENCODING: 'utf-8',
                    PYTHONUTF8: '1',
                },
                maxBuffer: 20 * 1024 * 1024,
                windowsHide: true,
            }
        );

        if (result.error) {
            attempts.push(`${command}: ${result.error.message}`);
            continue;
        }

        const combined = `${result.stdout || ''}\n${result.stderr || ''}`;
        if (result.status === 0) {
            return {
                ok: true,
                output: combined,
                stdout: result.stdout || '',
                stderr: result.stderr || '',
            };
        }

        attempts.push(`${command}: ${(result.stderr || result.stdout || 'Unknown python error').trim()}`);
    }

    return { ok: false, error: attempts.join(' | ') };
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveAudioPath = (filePath) => {
    if (path.isAbsolute(filePath)) {
        return filePath;
    }
    return path.resolve(process.cwd(), filePath);
};

const formatTranscriptionError = (error) => {
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
        return 'OpenAI quota exceeded. Add billing at https://platform.openai.com/account/billing, then restart the backend.';
    }
    if (error?.status === 401) {
        return 'Invalid OpenAI API key. Update OPENAI_API_KEY in Backend/.env and restart the backend.';
    }
    if (error?.message?.includes('Connection error') || error?.cause?.code === 'ECONNRESET') {
        return 'Could not connect to OpenAI. Check your internet connection and try again.';
    }
    return error?.message || 'Unable to transcribe audio';
};

const isFatalOpenAIError = (error) =>
    error?.status === 401 || error?.status === 429 || error?.code === 'insufficient_quota';

// True when text is mostly Latin letters (English / romanized).
const looksLikeEnglish = (text = '') => {
    const latin = (text.match(/[A-Za-z]/g) || []).length;
    const nonLatinLetters = (text.match(/[^\x00-\x7F]/g) || []).filter((ch) => /\p{L}/u.test(ch)).length;
    if (latin === 0 && nonLatinLetters === 0) return false;
    return latin >= Math.max(12, nonLatinLetters * 2);
};

const translateTextToEnglish = async (openai, text) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
            {
                role: 'system',
                content:
                    'You translate speech transcripts into clear English. Preserve names, numbers, and meaning. Output English only, with no preface.',
            },
            {
                role: 'user',
                content: text,
            },
        ],
    });
    return response.choices?.[0]?.message?.content?.toString()?.trim() || '';
};

const whisperAudioToEnglish = async (openai, audioBuffer, fileName) => {
    const translationAttempts = [
        { temperature: 0, prompt: 'Translate the spoken audio into English.' },
        { temperature: 0.2 },
        { temperature: 0.9 },
    ];

    let lastError = null;

    for (const options of translationAttempts) {
        try {
            const translation = await openai.audio.translations.create({
                file: await toFile(audioBuffer, fileName),
                model: 'whisper-1',
                response_format: 'text',
                ...options,
            });
            const text = (typeof translation === 'string' ? translation : translation?.text)
                ?.toString()
                ?.trim() || '';
            if (text) {
                if (looksLikeEnglish(text)) return text;
                // Sometimes translations still emit source language — force English via GPT.
                const english = await translateTextToEnglish(openai, text);
                if (english) return english;
                return text;
            }
            console.warn('Whisper translation returned empty text', options);
        } catch (error) {
            lastError = error;
            console.error('Whisper translation failed:', error?.message || error, options);
            if (isFatalOpenAIError(error)) {
                throw new Error(formatTranscriptionError(error));
            }
        }
    }

    // Fallback: native-language transcription, then GPT → English (helps Nepali, Hindi, etc.)
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: await toFile(audioBuffer, fileName),
            model: 'whisper-1',
            response_format: 'text',
            temperature: 0,
        });
        const text = (typeof transcription === 'string' ? transcription : transcription?.text)
            ?.toString()
            ?.trim() || '';
        if (text) {
            if (looksLikeEnglish(text)) return text;
            const english = await translateTextToEnglish(openai, text);
            if (english) return english;
            return text;
        }
        console.warn('Whisper transcription returned empty text');
    } catch (error) {
        lastError = error;
        console.error('Whisper transcription failed:', error?.message || error);
        if (isFatalOpenAIError(error)) {
            throw new Error(formatTranscriptionError(error));
        }
    }

    throw new Error(formatTranscriptionError(lastError));
};

// Any-language audio → English text for summary / frequency / context.
const transcribeWithFallback = async (audioBuffer, fileName) => {
    const openai = getOpenAIClient();
    let lastError = null;

    for (let index = 0; index < 2; index += 1) {
        try {
            return await whisperAudioToEnglish(openai, audioBuffer, fileName);
        } catch (error) {
            lastError = error;
            console.error(`Audio→English attempt ${index + 1} failed:`, error?.message || error);
            if (isFatalOpenAIError(error) || error?.message?.includes('OpenAI API key') || error?.message?.includes('quota') || error?.message?.includes('Invalid OpenAI')) {
                throw error;
            }
        }
        await wait(1000 * (index + 1));
    }

    throw new Error(formatTranscriptionError(lastError));
};

const sliceAudioIntoChunks = async (audioBuffer, sourcePath = 'audio.mp3') => {
    if (!ffmpegStatic) {
        console.warn('ffmpeg-static not available, using full audio file');
        return [audioBuffer];
    }

    const extension = path.extname(sourcePath).replace('.', '') || 'mp3';
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'audio-chunks-'));
    const inputFile = path.join(tempDir, `input.${extension}`);
    const outputPattern = path.join(tempDir, 'chunk_%03d.mp3');

    try {
        await fs.writeFile(inputFile, audioBuffer);
        await execFileAsync(
            ffmpegStatic,
            [
                '-i', inputFile,
                '-ar', '16000',
                '-ac', '1',
                '-f', 'segment',
                '-segment_time', String(CHUNK_SECONDS),
                '-c:a', 'libmp3lame',
                '-b:a', '64k',
                outputPattern,
            ],
            { windowsHide: true }
        );

        const files = (await fs.readdir(tempDir))
            .filter((name) => name.startsWith('chunk_') && name.endsWith('.mp3'))
            .sort();

        if (files.length === 0) {
            return [audioBuffer];
        }

        return Promise.all(files.map((file) => fs.readFile(path.join(tempDir, file))));
    } catch (error) {
        console.warn('Audio slicing failed, using full file:', error?.message || error);
        return [audioBuffer];
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
};

const transcribeChunks = async (buffers, jobId) => {
    const totalChunks = buffers.length;
    const transcripts = new Array(totalChunks).fill('');
    let completedChunks = 0;
    let nextIndex = 0;
    let lastChunkError = null;

    updateJobProgress(jobId, {
        totalChunks,
        currentChunk: 0,
        percent: 5,
        message: totalChunks > 1
            ? `Split audio into ${totalChunks} segments`
            : 'Transcribing audio...',
    });

    const worker = async () => {
        while (nextIndex < totalChunks) {
            const chunkIndex = nextIndex;
            nextIndex += 1;

            updateJobProgress(jobId, {
                currentChunk: chunkIndex + 1,
                message: `Transcribing segment ${chunkIndex + 1} of ${totalChunks}...`,
                percent: Math.min(95, Math.round((completedChunks / totalChunks) * 100)),
            });

            try {
                const chunkText = await transcribeWithFallback(
                    buffers[chunkIndex],
                    `chunk-${chunkIndex + 1}.mp3`
                );
                transcripts[chunkIndex] = chunkText;
            } catch (error) {
                lastChunkError = error;
                console.error(
                    `Segment ${chunkIndex + 1}/${totalChunks} failed:`,
                    error?.message || error
                );
                if (isFatalOpenAIError(error) || /quota|API key|Invalid OpenAI/i.test(error?.message || '')) {
                    throw error;
                }
                // Skip empty/bad segment instead of failing the whole video.
                transcripts[chunkIndex] = '';
            }

            completedChunks += 1;
            updateJobProgress(jobId, {
                currentChunk: chunkIndex + 1,
                percent: Math.min(95, Math.round((completedChunks / totalChunks) * 100)),
                message: `Finished segment ${chunkIndex + 1} of ${totalChunks}`,
            });
        }
    };

    const workers = Array.from(
        { length: Math.min(CHUNK_CONCURRENCY, totalChunks) },
        () => worker()
    );
    await Promise.all(workers);

    const combined = transcripts.filter(Boolean).join(' ').trim();
    if (!combined && lastChunkError) {
        throw lastChunkError;
    }
    return combined;
};
const findOccurrences = (text, entity) => {
    // Escape special characters in the entity for use in a regular expression
    const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create a regular expression to find all occurrences of the entity (case insensitive)
    const regex = new RegExp(escapedEntity, 'gi');
    // Use match to find all matches in the text
    const matches = text.match(regex);
    // Return the count of matches
    return matches ? matches.length : 0;
};
export const extractPersonOccurence = async (req, res) => {


    const { text, entities } = req.body;

    if (!text || !Array.isArray(entities)) {
        return res.status(404).send({
            success: false,
            message: 'Text and entity must be provided',
        });
    }

    const results = entities.map(entity => ({
        entity,
        count: findOccurrences(text, entity),
    }));

    res.status(200).send({
        success: true,
        message: 'Occurences found Successfully',
        results,
    });

};

// function contextualAnalysis() {
//     console.log("hi i am in contextual analysis");
//     let resultString = '';
//     const text = "Under the leadership of Prime Minister Shehbaz Sharif, the cabinet meeting will take place. In the future, the budget of the financial year will be considered. The ECC's decisions will be approved. The National Economic Council has approved a budget of Rs 1,500 billion. For infrastructure, Rs 827 billion and Rs 253 billion will be spent on construction projects. The World Bank has approved a budget of $1 billion for Pakistan. The budget will be spent on the construction of Dasu Dam. The World Bank says that the Dasu Hydro project will be a game-changer for Pakistan. Cheap electricity will be generated. In the first phase, electricity will be generated at a capacity of 2160 megawatts."

//     // const py = spawn('python', ['corefres.py', text])
//     // py.stdout.on('data', function (stdData) {
//     //     console.log(stdData.toString());
//     //     resultString += stdData.toString();
//     // });
//     const py = spawn('python', ['corefres.py', text])
//     py.stdout.on('data', function (stdData) {
//         resultString += stdData.toString();
//     });
//     console.log(resultString);
//     console.log("Printing Output");
//     console.log(resultString);
// };

export const extractAudioFile = async (req, res) => {

    try {
        const audioUrl = req.body?.audio?.trim();
        if (!audioUrl) {
            return res.status(400).send({
                success: false,
                message: "Audio URL is required",
            });
        }

        const pythonResult = runPythonScript('linkdownloader.py', [audioUrl]);

        if (!pythonResult.ok) {
            const scriptError = pythonResult.error || '';
            const isPytubeHttpError = scriptError.includes('HTTP Error 400');

            return res.status(isPytubeHttpError ? 400 : 500).send({
                success: false,
                message: isPytubeHttpError
                    ? "YouTube rejected this link. Try another public video URL."
                    : "Error while downloading audio file",
                error: scriptError,
            });
        }

        console.log(pythonResult.output);

        const combinedOutput = pythonResult.output || '';
        const pathMatch = combinedOutput.match(/DOWNLOAD_PATH:(.+)/);
        let filePath = pathMatch?.[1]?.trim();

        // Fallback: marker file written by linkdownloader.py
        if (!filePath) {
            const markerPath = path.join(process.cwd(), 'Downloads', 'last_download.json');
            if (fsSync.existsSync(markerPath)) {
                try {
                    const marker = JSON.parse(fsSync.readFileSync(markerPath, 'utf-8'));
                    filePath = marker?.path;
                } catch (markerError) {
                    console.error('Failed reading download marker:', markerError.message);
                }
            }
        }

        // Fallback: newest audio_* file in Downloads
        if (!filePath || !fsSync.existsSync(filePath)) {
            const downloadsDir = path.join(process.cwd(), 'Downloads');
            if (fsSync.existsSync(downloadsDir)) {
                const newest = fsSync.readdirSync(downloadsDir)
                    .filter((name) => name.startsWith('audio_') && !name.endsWith('.part') && !name.endsWith('.json'))
                    .map((name) => {
                        const full = path.join(downloadsDir, name);
                        return { full, mtime: fsSync.statSync(full).mtimeMs };
                    })
                    .sort((a, b) => b.mtime - a.mtime)[0];
                if (newest) {
                    filePath = newest.full;
                }
            }
        }

        if (!filePath || !fsSync.existsSync(filePath)) {
            return res.status(500).send({
                success: false,
                message: "Download finished but audio path was not returned",
                error: combinedOutput,
            });
        }

        console.log(`Using freshly downloaded audio: ${filePath}`);

        return res.status(200).send({
            success: true,
            message: "File Downloaded Successfully",
            path: filePath,
            sourceUrl: audioUrl,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Download Request Failed",
            error,
        });
    }
};

export const extractTextFromAudio = async (req, res) => {

    const jobId = req.body?.jobId || crypto.randomUUID();
    initJobProgress(jobId);

    try {
        if (!process.env.OPENAI_API_KEY?.trim()) {
            failJobProgress(jobId, 'OpenAI API key not configured');
            return res.status(500).send({
                success: false,
                message: 'OpenAI API key not configured. Add OPENAI_API_KEY to Backend/.env and restart the server.',
            });
        }

        const filePath = resolveAudioPath(req.body?.audiopath);
        if (!filePath) {
            failJobProgress(jobId, 'Audio path is required');
            return res.status(400).send({
                success: false,
                message: "Audio path is required",
            });
        }

        console.log(filePath);
        const audioBuffer = await fs.readFile(filePath);
        const buffers = await sliceAudioIntoChunks(audioBuffer, filePath);
        const resultString = await transcribeChunks(buffers, jobId);

        if (!resultString) {
            failJobProgress(jobId, 'No transcript text could be extracted');
            return res.status(422).send({
                success: false,
                message: "No transcript text could be extracted from audio",
            });
        }

        completeJobProgress(jobId);

        res.status(200).send({
            success: true,
            message: "Transcription Done Successfully",
            text: resultString,
            jobId,
        });


    } catch (error) {
        console.error("extractTextFromAudio failed:", error?.message || error);
        const message = error?.message || 'Transcription failed';
        failJobProgress(jobId, message);
        res.status(500).send({
            success: false,
            message,
        });
    }
};

async function query(data) {

    try {
        const hfToken = process.env.HUGGINGFACE_API_KEY?.trim();
        if (!hfToken) {
            return {
                ok: false,
                error: 'Hugging Face API key not configured. Add HUGGINGFACE_API_KEY to Backend/.env and restart the server.',
            };
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/csebuetnlp/mT5_multilingual_XLSum",
            {
                headers: { Authorization: `Bearer ${hfToken}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        if (!response.ok) {
            return {
                ok: false,
                error: result?.error || `HuggingFace API error (${response.status})`,
                details: result,
            };
        }
        return {
            ok: true,
            data: result,
        };

    } catch (error) {
        return {
            ok: false,
            error: error?.message || "Failed to call summarization model",
        };
    }


};
export const summarizeText = async (req, res) => {

    try {
        const input_text = req.body.inputtext;
        if (!input_text || !input_text.trim()) {
            return res.status(400).send({
                success: false,
                message: "Input text is required for summarization",
            });
        }
        const parts = input_text.split('::');
        // console.log(parts);  // This will give you an array of the individual translated segments

        let summary = '';
        for (const part of parts) {
            const partSummaryResponse = await query({
                inputs: part,
                parameters: { min_length: 100 },
            });
            if (!partSummaryResponse.ok) {
                console.error('Summarization API error:', partSummaryResponse.error, partSummaryResponse.details);
                // Fallback: keep pipeline moving by using original chunk text.
                summary += part + '::';
                continue;
            }

            const data = partSummaryResponse.data;
            const partSummary = Array.isArray(data)
                ? (data[0]?.summary_text || data[0]?.generated_text)
                : (data?.summary_text || data?.generated_text);

            if (partSummary && String(partSummary).trim()) {
                summary += String(partSummary).trim() + '::';
            } else {
                console.error('Unexpected response format:', data);
                // Fallback if model returns an unsupported shape.
                summary += part + '::';
            }
        }

        // Remove the last identifier if added
        if (summary.endsWith('::')) {
            summary = summary.slice(0, -2);
        }

        // console.log("All Summ" + summary);
        res.status(200).send({
            success: true,
            message: "Summarization Done Successfully",
            text: summary,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while Summarization",
            error,
        });
    }
};
function getSentencesWithName(text, names) {
    const cleanNames = (names || [])
        .map((name) => String(name || '').trim())
        .filter(Boolean);

    if (!text || cleanNames.length === 0) {
        return [];
    }

    // Support English and Urdu sentence endings.
    const sentences = String(text)
        .split(/(?<=[.!?۔؟\n])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    const lowerNames = cleanNames.map((name) => name.toLowerCase());

    return sentences.filter((sentence) => {
        const lowerSentence = sentence.toLowerCase();
        return cleanNames.some((name, index) =>
            sentence.includes(name) || lowerSentence.includes(lowerNames[index])
        );
    });
}

export const extractPersonContext = async (req, res) => {
    try {
        const { text, entities } = req.body;

        if (!text || !Array.isArray(entities)) {
            return res.status(400).send({
                success: false,
                message: 'Text and entity must be provided',
            });
        }

        const cleanEntities = entities
            .map((entity) => String(entity || '').trim())
            .filter(Boolean);

        if (cleanEntities.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Enter at least one entity for contextual analysis',
            });
        }

        console.log('Contextual analysis for entities:', cleanEntities);

        // Fast in-process sentence matching (no Python spawn).
        // This avoids blocking the Node server and Network Errors on the frontend.
        const results = {};
        cleanEntities.forEach((entity) => {
            const filteredSentences = getSentencesWithName(text, [entity]);
            results[entity] = filteredSentences.length > 0
                ? filteredSentences
                : ['No context found'];
        });

        console.log(results);

        return res.status(200).send({
            success: true,
            message: 'Contextual analysis completed',
            resolvedText: text,
            entityContexts: results,
        });
    } catch (error) {
        console.error('Context analysis error:', error);
        return res.status(500).send({
            success: false,
            message: error?.message || 'An error occurred while context analysis',
        });
    }
};


    // try {
    //     const { text, entities } = req.body;

    //     if (!text || !Array.isArray(entities)) {
    //         return res.status(404).send({
    //             success: false,
    //             message: 'Text and entity must be provided',
    //         });
    //     }
    //     console.log(text);
    //     // const parts = input_text.split('::');
    //     const resultString = '';
    //     const py = spawn('python', ['corefres.py', text])
    //     py.stdout.on('data', function (stdData) {
    //         resultString += stdData.toString();
    //     });
    //     console.log(resultString);
    //     console.log("After printing result string Output");
    //     console.log(resultString);

    // } catch (error) {
    //     console.log("HI error ");
    //     console.log(error);
    // }

export const speechToTextController = async (req, res) => {

    try {
        // const filePath = path.join('Downloads', 'audio.mp3');
        // const pythonProcess1 = execFileSync('python', ['linkdownloader.py', req.body.audio])
        // if (pythonProcess1.error) {
        //     console.log("fjiivb");

        //     console.error(pythonProcess1.error);
        //     // Handle the error
        // }
        // else {
        //     // Process the output of the Python script if needed
        //     console.log(pythonProcess1.toString());
        // }
        // // const filePath = path.join(downloadsPath, req.body.audio + '.mp3');
        // const audioBuffer = await fs.readFile(filePath)
        // // Specify segment duration in seconds (e.g., 60 seconds)
        // const seconds = 60;
        // // Specify whether it's video (true) or audio (false)
        // const video = false;
        // // Call the mediaToSlice function
        // const buffers = await audioToSlice(audioBuffer, seconds, video);
        // console.log(`Sliced into ${buffers.length} segments.`);
        // let resultString = '';
        // for (const buffer of buffers) {
        //     // Translate audio using OpenAI API
        //     const translation = await openai.audio.translations.create({
        //         file: await toFile(buffer, 'audio.mp3'), // Assuming 'audio.mp3' as a temporary name
        //         model: 'whisper-1',
        //     });
        //     console.log(translation.text);

        //     const counts = countPhraseOccurrences(translation.text);

        //     Object.entries(counts).forEach(([phrase, count]) => {
        //         console.log(`The phrase "${phrase}" appears ${count} times in the text.`);
        //     });
        //     await query({ "inputs": translation.text, "parameters": { min_length: 100 }, })
        //         .then((response) => {
        //             console.log(JSON.stringify(response));
        //         });
        //     //resultString += JSON.stringify(response);
        //     const py = spawn('python', ['corefres.py', translation.text])
        //     py.stdout.on('data', function (stdData) {
        //         resultString += stdData.toString();
        //     });
        // }

        contextualAnalysis();
        // let result = getSentencesWithName(resultString, req.body.person);
        // console.log(result);
        // Set CORS headers to allow requests from all origins (change '*' to your frontend URL in production)
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        // Send back the translated text
        // res.json({ text: JSON.stringify(response) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


};





// try {
//     // Get the user's home directory
//     const homeDir = os.homedir();
//     // Construct the path to the downloads directory
//     const downloadsPath = path.join(homeDir, 'Downloads');
//     // Use downloadsPath to construct the full path to the file
//     // Modify the file path construction as needed based on your requirements
//     req.body.audio = req.body.audio.replace(/ \| /g, " _ ");
//     const filePath = path.join(downloadsPath, req.body.audio + '.mp3');
//     // const filePath = 'NE.mp3';
//     // path.join(downloadsPath, req.body.audio + '.mp3');
//     const audioBuffer = await fs.readFile(filePath)
//     // Specify segment duration in seconds (e.g., 60 seconds)
//     const seconds = 60;
//     // Specify whether it's video (true) or audio (false)
//     const video = false;
//     // Call the mediaToSlice function
//     const buffers = await audioToSlice(audioBuffer, seconds, video);
//     console.log(`Sliced into ${buffers.length} segments.`);
//     const translations = [];
//     for (const buffer of buffers) {
//         // Translate audio using OpenAI API
//         const translation = await openai.audio.translations.create({
//             file: await toFile(buffer, 'audio.mp3'), // Assuming 'audio.mp3' as a temporary name
//             model: 'whisper-1',
//         });
//         console.log(translation.text)

//         // Set CORS headers to allow requests from all origins (change '*' to your frontend URL in production)
//         // res.set('Access-Control-Allow-Origin', '*');
//         // res.set('Access-Control-Allow-Methods', 'POST');
//         // res.set('Access-Control-Allow-Headers', 'Content-Type');

//         // Send back the translated text
//         // res.json({ text: translation.text });
//         translations.push({ text: translation.text });
//     }
//     // Send back all translations once the loop is finished
//     res.json(translations);
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
// }
