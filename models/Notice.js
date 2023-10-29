import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true,
        },
        description: {
            type: String, required: true,
        },
        images: {
            type: [String], default: []
        },
        userId: {
            type: String, required: true,
        }
    },
    {
        timestamps: true
    }
)

const Notice = mongoose.model('Notice', NoticeSchema);
export default Notice