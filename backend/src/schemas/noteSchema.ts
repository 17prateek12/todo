import mongoose, { Schema } from "mongoose";
import { INotes } from "../interface/interface";

const noteSchema = new Schema<INotes>({
    todo: {
        type: Schema.Types.ObjectId,
        ref: 'todo',
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

export default mongoose.model<INotes>('Notes', noteSchema);