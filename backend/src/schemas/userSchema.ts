import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/interface";

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique:true,
    },
    displayname: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique:true,
    },
    password: {
        type: String,
        required: [true, 'Pleaee put a password'],
    },
    profilePhoto: {
        type: String,
        required: false,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    registrationTime: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', userSchema);