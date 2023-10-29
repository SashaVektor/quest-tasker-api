import mongoose from "mongoose";

export const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String, required: true,
        },
        description: {
            type: String, required: true,
        },
        userId: {
            type: String, required: true,
        },
        priority: {
            type: String, required: true,
        },
        status: {
            type: String, required: true,
        },
        dueDate: {
            type: String, required: true,
        },
        folderId: {
            type: String, required: true,
        },
        images: {
            type: [String], default: []
        },
        subTasks: {
            type: [{
                title: {
                    type: String
                },
                status: {
                    type: String
                }
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', TaskSchema);
export default Task