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
        enum: ['Pending', 'Completed' , 'Overdue'],
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
    dueDate: {
        type: Date,
        required: true,
    },
    notes:[{
        type: Schema.Types.ObjectId,
        ref:'Notes',
    }]
}, {
    timestamps: true
});

todoSchema.pre("find", async function (next) {
    await this.model.updateMany(
        { status: "Pending", dueDate: { $lt: new Date() } },
        { $set: { status: "Overdue" } },
        { multi: true }
    );
    next();
});



export default mongoose.model<ITodo>("Todo", todoSchema);

