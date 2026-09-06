import { Router } from "express";
import { speechToTextController, extractAudioFile, extractTextFromAudio, getExtractTextProgress, summarizeText, extractPersonOccurence, extractPersonContext } from "../controllers/speechToTextController.js";
//router object required for keeping routing of api in separate files
const router = Router();

// POST Method :  /user/generate

// /signup validating user input fields
router.post('/speechTotext', speechToTextController);
// extracting audio from video
router.post('/extractAudio', extractAudioFile);
// extracting text from audio
router.post('/extractText', extractTextFromAudio);
router.get('/extractText/progress/:jobId', getExtractTextProgress);
// summatzing text
router.post('/summarizeText', summarizeText);
// occurence in  text
router.post('/frequency', extractPersonOccurence);
// context  in  text
router.post('/contextualAnalysis', extractPersonContext);
export default router;
