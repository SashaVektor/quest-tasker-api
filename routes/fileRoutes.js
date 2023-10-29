import express from "express"
import { isAuth } from "../utils.js";
import { createFile, deleteFile, getUserFiles } from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/", isAuth, createFile)

fileRouter.get("/", getUserFiles)

fileRouter.delete("/:id", deleteFile)

export default fileRouter