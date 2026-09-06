import OpenAI, { toFile } from 'openai';
import fs from 'fs/promises';
import { audioToSlice } from "audio-slicer";
import { readFile } from "fs/promises";

const openai = new OpenAI();
const filePath = 'U6.mp3';
const audioData=fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
});
async function main() {
  try {
    // Read the media file as a buffer (can be audio or video)
    const media = await readFile(filePath);
    // Specify segment duration in seconds (e.g., 60 seconds)
    const seconds = 60;
    // Specify whether it's video (true) or audio (false)
    const video = false;
    // Call the mediaToSlice function
    const buffers = await audioToSlice(media, seconds, video);
    console.log('Sliced into ${buffers.length} segments.');

    // Process each segment separately
    for (const buffer of buffers) {
      const translation = await openai.audio.translations.create({
        file: await toFile(buffer, 'segment.mp3'), // Assuming 'segment.mp3' as a temporary name
        model: 'whisper-1',
      });
      console.log(translation.text); // Log translation for each segment
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

    // const translation = await openai.audio.translations.create({
    //     file: await toFile(audioData,'U6.mp3'),
    //     model: 'whisper-1',
    //   });
    //   console.log(translation.text);
}
main();

