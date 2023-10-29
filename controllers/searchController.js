import expressAsyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import Folder from "../models/Folder.js";
import Notice from "../models/Notice.js";
import File from "../models/File.js";

export const getSearchedItems = expressAsyncHandler(async (req, res) => {
    try {
        const { userId, searchTerm } = req.query;

        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }

        if (searchTerm.length > 0) {
            const searchRegex = new RegExp(searchTerm, 'i');

            const tasks = (await Task.find({ title: searchRegex, userId }))
            const folders = await Folder.find({ title: searchRegex, userId })
            const notices = await Notice.find({ title: searchRegex, userId })
            const files = await File.find({ title: searchRegex, userId })

            const searchedTasks = tasks.slice(0, 3)
            const searchedFolders = folders.slice(0, 3)
            const searchedNotices = notices.slice(0, 3)
            const searchedFiles = files.slice(0, 3)

            res.send({
                tasks: searchedTasks, folders: searchedFolders,
                notices: searchedNotices, files: searchedFiles
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})