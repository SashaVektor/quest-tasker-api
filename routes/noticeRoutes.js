import express from 'express'
import { createNotice, deleteNotice, getAllNotices } from '../controllers/noticeController.js';
import { isAuth } from '../utils.js';

const noticeRouter = express.Router();

noticeRouter.get("/", getAllNotices)
noticeRouter.post("/", isAuth, createNotice)
noticeRouter.delete("/:id", isAuth, deleteNotice)

export default noticeRouter