import { Router } from "express";
import { getReportsByUserId, addReport } from "../controllers/reportcontroller.js";

const router = Router();
// this auth middle ware ensures that users is login then is admin checked


// getting a user by id
router.get('/getreports/:id', getReportsByUserId);

// adding user
router.post('/addreport', addReport);

export default router;
