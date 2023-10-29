import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true,
        },
        file: {
            type: String, required: true
        },
        userId: {
            type: String, required: true,
        }
    },
    {
        timestamps: true
    }
)

const File = mongoose.model('File', FileSchema);
export default File