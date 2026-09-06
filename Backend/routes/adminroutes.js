import { Router } from "express";
import { getAllUsers, deleteUserById, getUserById, updateUserById, addUser } from "../controllers/admincontroller.js";
import { getAllActivities } from "../controllers/reportcontroller.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { AdminMiddleware } from "../middleware/adminMiddleware.js";
const router = Router();
// this auth middle ware ensures that users is login then is admin checked

// getting users
router.get('/users', AuthMiddleware, AdminMiddleware, getAllUsers);

// getting a user by id
router.get('/users/:id', AuthMiddleware, AdminMiddleware, getUserById);

// updating user
router.patch('/users/update/:id', AuthMiddleware, AdminMiddleware, updateUserById);
// getting delete user
router.delete('/users/delete/:id', AuthMiddleware, AdminMiddleware, deleteUserById);
// adding user
router.post('/users/add', AuthMiddleware, AdminMiddleware, addUser);

// all user activities / reports
router.get('/activities', AuthMiddleware, AdminMiddleware, getAllActivities);

export default router;
