import expressAsyncHandler from "express-async-handler"
import Notice from "../models/Notice.js";

export const getAllNotices = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            res.status(404).send({ message: "userId Not Found" })
            return
        }
        
        const userNotices = await Notice.find({userId});

        const noticesWithoutuserId = userNotices.map((notice) => ({
            title: notice.title,
            description: notice.description,
            _id: notice._id,
            images: notice.images,
            createdAt: notice.createdAt,
            updatedAt: notice.updatedAt
        })).sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).send(noticesWithoutuserId)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const createNotice = expressAsyncHandler(async (req, res) => {
    try {
        const notice = req.body;

        const newNotice = new Notice({
            title: notice.title,
            userId: notice.userId,
            description: notice.description,
            images: notice.images || []
        })

        const note = await newNotice.save();

        if(!note) {
            res.status(403).send({message: "Create notice failed"})
            return
        }

        res.status(200).send({message: "Notice was created sucessfully"})
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const deleteNotice = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.query;

        const notice = await Notice.findById({_id: id})

        if(!notice) {
            res.status(404).send({message: "Notice not found"})
            return
        }

        if(notice.userId !== userId) {
            res.status(403).send({message: "This is not your notice"})
            return
        }

        await notice.deleteOne();

        res.send({ message: "Notice deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})