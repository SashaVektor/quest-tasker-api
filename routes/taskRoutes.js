import express from 'express'
import { isAuth } from '../utils.js';
import {
    createTaskInFolder, deleteTaskInFolder,
    updateTask, getUserTasks
} from '../controllers/taskController.js';


const taskRouter = express.Router();

taskRouter.get("/", getUserTasks)

taskRouter.post("/", isAuth, createTaskInFolder)

taskRouter.patch("/:id", isAuth, updateTask)

taskRouter.delete("/:id", isAuth, deleteTaskInFolder)


export default taskRouter