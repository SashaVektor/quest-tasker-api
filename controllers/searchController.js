import expressAsyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import Folder from "../models/Folder.js";
import Notice from "../models/Notice.js";
import File from "../models/File.js";

export const getSearchedItems = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, searchTerm } = req.query;

    if (!userId) {
      return res.status(404).send({ message: "userId Not Found" });
    }

    if (searchTerm.length > 0) {
      const searchRegex = new RegExp(searchTerm, 'i');

      const [tasks, folders, notices, files] = await Promise.all([
        Task.find({ title: searchRegex, userId }).limit(3),
        Folder.find({ title: searchRegex, userId }).limit(3),
        Notice.find({ title: searchRegex, userId }).limit(3),
        File.find({ title: searchRegex, userId }).limit(3),
      ]);

      res.send({
        tasks,
        folders,
        notices,
        files,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});