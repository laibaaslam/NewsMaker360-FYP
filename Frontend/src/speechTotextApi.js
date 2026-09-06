import axios from 'axios';

const API_BASE = 'http://localhost:8080/user/generate';
const TRANSCRIPTION_TIMEOUT_MS = 10 * 60 * 1000;

const createJobId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const pollTranscriptionProgress = (jobId, onProgress) => {
    if (!onProgress) return null;

    return setInterval(async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/extractText/progress/${jobId}`);
            if (data?.progress) {
                onProgress(data.progress);
            }
        } catch {
            // Progress may not exist yet or job already finished.
        }
    }, 1000);
};

export const generateText = async (audioData, personList) => {
    try {

        console.log("Sending Request ");
        const response = await axios.post('http://localhost:8080/user/generate/speechTotext', { audio: audioData, person: personList });
        console.log(" Request Fulfiled ");
        console.log(response.data.text); // Log translated text
    } catch (error) {
        console.log(" Request failed ");
        console.error('Error:', error.message);
    }
};

export const extractAudioFile = async (audioData) => {

    try {

        console.log("Sending Download Request ");
        const response = await axios.post('http://localhost:8080/user/generate/extractAudio', { audio: audioData });
        console.log(" Request Fulfiled ");
        console.log(response.data.path); // Log translated text
        return response;

    } catch (error) {
        console.log("Request to Download Audio Failed");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message);
    }

};
export const extractTextFromAudio = async (path, onProgress) => {

    const jobId = createJobId();
    const pollHandle = pollTranscriptionProgress(jobId, onProgress);

    try {

        console.log("Sending text Extraction Request ");
        const response = await axios.post(`${API_BASE}/extractText`, { audiopath: path, jobId }, {
            timeout: TRANSCRIPTION_TIMEOUT_MS,
        });
        console.log(" Request Fulfiled ");
        console.log(response.data.text);
        return response;

    } catch (error) {
        console.log("Request to extract text Failed");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message);
    } finally {
        if (pollHandle) {
            clearInterval(pollHandle);
        }
    }

};
export const summarizeText = async (text) => {

    try {

        console.log("Sending Summarization Request ");
        const response = await axios.post('http://localhost:8080/user/generate/summarizeText', { inputtext: text });
        console.log(" Request Fulfiled ");
        console.log(response.data.text); // Log translated text
        return response;

    } catch (error) {
        console.log("Request to Summarization Failed");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message);
    }

};
export const findPersonOccurrence = async (input, persons) => {

    try {

        console.log("Sending Occurrence Request ");
        const response = await axios.post('http://localhost:8080/user/generate/frequency', { text: input, entities: persons });
        console.log(" Request Fulfiled ");
        console.log(response.data.results); // Log translated text
        return response;

    } catch (error) {
        console.log("Request to Occurrence Failed");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message);
    }

};

export const findPersonContext = async (input, persons) => {

    try {

        console.log("Sending Context Request ");
        const response = await axios.post('http://localhost:8080/user/generate/contextualAnalysis', { text: input, entities: persons });
        console.log(" Request Fulfiled ");
        console.log(response.data.entityContexts); // Log translated text
        return response;

    } catch (error) {
        console.log("Request to Context Failed");
        console.error('Error:', error.message);
        throw new Error(error.response?.data?.message || error.message);
    }

};