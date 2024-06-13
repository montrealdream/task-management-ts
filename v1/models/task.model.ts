import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        createBy: String,
        title: String,
        content: String,
        status: String,
        taskParentId: String,
        listUserJoin: {
            type: Array,
            default: []
        },
        timeStart: String,
        timeFinish: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', TaskSchema, 'tasks');

export default Task;