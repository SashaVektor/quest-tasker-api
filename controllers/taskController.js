import expressAsyncHandler from "express-async-handler";
import Task from "../models/Task.js";

export const getUserTasks = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }

        const tasks = (await Task.find({ userId })).sort((a, b) => b.createdAt - a.createdAt);

        if(!tasks) {
            res.status(404).send({ message: "This user have not tasks" })
            return
        }

        res.status(200).send(tasks)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const createTaskInFolder = expressAsyncHandler(async (req, res) => {
    try {
        const task = req.body;

        const { userId } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }

        if (!task) {
            res.status(404).send({ message: "Task Data not Found" })
            return
        }

        const newTask = new Task({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            subTasks: task.subTasks || [],
            userId,
            images: task.images || [],
            dueDate: task.dueDate,
            folderId: task.folderId
        })

        const file = await newTask.save();

        if (!file) {
            res.status(403).send({ message: "Task creation failed" })
            return
        }

        res.status(200).send({ message: "Task was created sucessfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const deleteTaskInFolder = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const task = await Task.findById({ _id: id })

        if (!task) {
            res.status(404).send({ message: "Task not found" })
            return
        }

        if (task.userId !== userId) {
            res.status(403).send({ message: "This is not your task" })
            return
        }

        await task.deleteOne();

        res.send({ message: "Task deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const updateTask = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findOne({ _id: id })

        const { userId } = req.query;

        if (task.userId !== userId) {
            res.status(403).send({ message: "This is not your task" })
            return
        }

        if (task) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.priority = req.body.priority || task.priority
            task.status = req.body.status || task.status
            task.dueDate = req.body.dueDate || task.dueDate
            task.images = req.body.images || task.images
            task.subTasks = req.body.subTasks || task.subTasks

            const updatedTask = await task.save();
            if (!updatedTask) {
                res.status(403).send({ message: "Updated not successfully" })
                return
            }

            res.status(200).send({ message: "Task updated successfully" })
        } else {
            res.status(404).send({ message: "Task not found" })
        }
    } catch (err) {
        res.status(400).send(err)
    }
})