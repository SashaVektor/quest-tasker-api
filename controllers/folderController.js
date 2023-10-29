import expressAsyncHandler from "express-async-handler";
import Folder from "../models/Folder.js";
import Task from "../models/Task.js";

export const getFolder = expressAsyncHandler(async (req, res) => {
    try {
        const { folderId } = req.params;
        const folder = await Folder.findById({ _id: folderId });
        const tasks = await Task.find({ folderId });
        const { userId } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }

        if (!folder) {
            res.status(404).send({ message: "Folder Not Found" })
            return
        }

        const folderTasks = tasks
            .map((task) => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                folderId: task.folderId,
                images: task.images,
                status: task.status,
                dueDate: task.dueDate,
                subTasks: task.subTasks,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            }))
            .sort((a, b) => b.createdAt - a.createdAt)

        const userFolder = folder.userId === userId

        if (userFolder) {
            const folderWithoutuserId = {
                _id: folder._id,
                title: folder.title,
                type: folder.type,
                color: folder.color,
                tasks: folderTasks || [],
                isFavourite: folder.isFavourite,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt
            }
            res.status(200).send(folderWithoutuserId)
        } else {
            res.status(404).send({ message: "Access to this folder denied!" })
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const getFavouritesFolders = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }
        const folders = await Folder.find({ userId });

        const favouritesFolders = folders
            .filter((folder) => folder.isFavourite === true)
            .slice(0, 4)
            .sort((a, b) => b.createdAt - a.createdAt)


        res.status(200).send(favouritesFolders)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const getUserFolders = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" });
            return;
        }

        const tasks = await Task.find({ userId });
        const folders = await Folder.find({ userId });

        const foldersWithTasks = folders.map(folder => {
            const folderTasks = tasks
                .filter(task => task.folderId.toString() === folder._id.toString())
                .map(task => ({
                    _id: task._id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    images: task.images,
                    status: task.status,
                    dueDate: task.dueDate,
                    subTasks: task.subTasks,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                }))
                .sort((a, b) => b.createdAt - a.createdAt);

            return {
                _id: folder._id,
                title: folder.title,
                type: folder.type,
                color: folder.color,
                tasks: folderTasks,
                isFavourite: folder.isFavourite,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
            };
        }).sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).send(foldersWithTasks);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export const createFolder = expressAsyncHandler(async (req, res) => {
    try {
        const folder = req.body;

        const newFolder = new Folder({
            title: folder.title,
            color: folder.color,
            userId: folder.userId,
            type: folder.type,
        })

        const file = await newFolder.save();

        if (!file) {
            res.status(403).send({ message: "Folder creation failed" })
            return
        }

        res.status(200).send({ message: "Folder was created sucessfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const deleteFolderWithTasks = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const folder = await Folder.findById({ _id: id })

        if (!folder) {
            res.status(404).send({ message: "Folder not found" })
            return
        }

        if (folder.userId !== userId) {
            res.status(403).send({ message: "This is not your folder" })
            return
        }

        await folder.deleteOne();
        await Task.deleteMany({ folderId: id });

        res.send({ message: "Folder deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const updateFolderStatus = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const folder = await Folder.findOne({ _id: id })

        const { userId } = req.query;

        if (folder.userId !== userId) {
            res.status(403).send({ message: "This is not your folder" })
            return
        }

        if (folder) {
            folder.isFavourite = folder.isFavourite === true ? false : true

            const updatedFolder = await folder.save();
            if (!updatedFolder) {
                res.status(403).send({ message: "Updated not successfully" })
                return
            }

            res.status(200).send({ message: "Folder status updated successfully" })
        } else {
            res.status(404).send({ message: "Folder not found" })
        }
    } catch (err) {
        res.status(400).send(err)
    }
})