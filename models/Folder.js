import mongoose from "mongoose";
import { TaskSchema } from "./Task.js";

const FolderSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true,
        },
        color: {
            type: String, required: true,
        },
        type: {
            type: String, required: true,
        },
        userId: {
            type: String, required: true,
        },
        isFavourite: {
            type: Boolean, default: false
        },
    },
    {
        timestamps: true
    }
)

const Folder = mongoose.model('Folder', FolderSchema);
export default Folder