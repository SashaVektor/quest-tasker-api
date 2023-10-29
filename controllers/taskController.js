import expressAsyncHandler from "express-async-handler";
import Task from "../models/Task.js";

export const getUserTasks = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(404).send({ message: "userId Not Found" });
        }

        const tasks = await Task.find({ userId }).sort((a, b) => b.createdAt - a.createdAt);

        if (!tasks || tasks.length === 0) {
            return res.status(404).send({ message: "This user has no tasks" });
        }

        res.status(200).send(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export const createTaskInFolder = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;
        const taskData = req.body;

        if (!userId || !taskData) {
            return res.status(404).send({ message: "userId or Task Data not Found" });
        }

        const newTask = new Task({
            ...taskData,
            userId,
        });

        const savedTask = await newTask.save();

        if (!savedTask) {
            return res.status(403).send({ message: "Task creation failed" });
        }

        res.status(200).send({ message: "Task was created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export const deleteTaskInFolder = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }

        if (task.userId !== userId) {
            return res.status(403).send({ message: "This is not your task" });
        }

        await task.deleteOne();

        res.send({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export const updateTask = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }

        if (task.userId !== userId) {
            return res.status(403).send({ message: "This is not your task" });
        }

        updateTaskData(task, req.body);

        const updatedTask = await task.save();

        if (!updatedTask) {
            return res.status(403).send({ message: "Updated not successful" });
        }

        res.status(200).send({ message: "Task updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});


const updateTaskData = (task, data) => {
    task.title = data.title || task.title;
    task.description = data.description || task.description;
    task.priority = data.priority || task.priority;
    task.status = data.status || task.status;
    task.dueDate = data.dueDate || task.dueDate;
    task.images = data.images || task.images;
    task.subTasks = data.subTasks || task.subTasks;
}