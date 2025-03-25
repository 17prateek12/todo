import mongoose, { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document{
    username:string;
    email:string;
    password:string;
    displayname:string;
    profilePhoto:string;
    registrationTime:string;
    todos: mongoose.Types.ObjectId;
};

export interface DecodeToken{
    userId: string;
    email: string;
    username: string;
    displayname: string
};

export interface AuthenticationRequest extends Request{
    user?: DecodeToken
};

export interface IMention extends Request{
    userId: mongoose.Types.ObjectId;
    username: string;
}


export interface INotes extends Request{
    todo:mongoose.Types.ObjectId;
    content: string;
    createdBy:mongoose.Types.ObjectId;
    createdAt:Date;
};

export interface ITodo extends Request{
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Completed' | 'Overdue';
    tag:string[];
    mentions: IMention[];
    user: mongoose.Types.ObjectId;
    dueDate: Date;
    notes: INotes;
};