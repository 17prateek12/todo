import mongoose, { Schema } from "mongoose";
import { ITodo } from "../interface/interface";

const todoSchema = new Schema<ITodo>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: '',
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    tag: [{
        type: String,
    }],
    mentions: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    DueDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model<ITodo>("Todo", todoSchema);