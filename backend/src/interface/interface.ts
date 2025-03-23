import mongoose, { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document{
    username:string;
    email:string;
    password:string;
    displayname:string;
    profilePhoto:string;
    registrationTime:string;
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

export interface ITodo extends Request{
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Completed';
    tag:string[];
    mentions: IMention[];
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    DueDate: Date;
};