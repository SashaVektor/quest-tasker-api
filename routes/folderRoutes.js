import express from 'express'
import { isAuth } from '../utils.js';
import { createFolder, deleteFolderWithTasks, getFolder, getUserFolders, updateFolderStatus, getFavouritesFolders } from '../controllers/folderController.js';

const folderRouter = express.Router();

folderRouter.post("/", isAuth, createFolder)

folderRouter.get("/", getUserFolders)

folderRouter.get("/favourites", getFavouritesFolders)

folderRouter.get("/:folderId", getFolder)

folderRouter.delete("/:id", deleteFolderWithTasks)

folderRouter.patch("/status/:id", updateFolderStatus)

export default folderRouter