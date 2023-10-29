import expressAsyncHandler from "express-async-handler"
import File from "../models/File.js"

export const getUserFiles = expressAsyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            res.status(404).send({ message: "User ID Not Found" })
            return
        }
        
        const userFiles = await File.find({userId});

        const filesWithoutUserId = userFiles.map((file) => ({
            title: file.title,
            _id: file._id,
            file: file.file,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt
        })).sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).send(filesWithoutUserId)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const createFile = expressAsyncHandler(async (req, res) => {
    try {
        const file = req.body;

        const newFile = new File({
            title: file.title,
            userId: file.userId,
            file: file.file
        })

        const pdfFile = await newFile.save();

        if(!pdfFile) {
            res.status(403).send({message: "Upload file failed"})
            return
        }

        res.status(200).send({message: "File uploaded sucessfully"})
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

export const deleteFile = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.query;

        const file = await File.findById({_id: id})

        if(!file) {
            res.status(404).send({message: "File not found"})
            return
        }

        if(file.userId !== userId) {
            res.status(403).send({message: "This is not your file"})
            return
        }

        await file.deleteOne();

        res.send({ message: "File deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" })
    }
})