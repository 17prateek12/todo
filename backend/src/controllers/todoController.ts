import Todo from '../schemas/todoSchema';
import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import User from '../schemas/userSchema';
import { AuthenticationRequest } from '../interface/interface';
import mongoose from 'mongoose';

const createTodo = asyncHandler(async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const { title, description, priority, status, tag, mentions, dueDate } = req.body;
        const userId = req.user?.userId;

        console.log("Received new todo", title, description, priority, status, tag, mentions, dueDate);
        console.log("User ID:", userId);

        const existingTodo = await Todo.findOne({ title });

        if (existingTodo) {
            res.status(400).json({ message: "A todo with this title already exists. Please use a different title." });
            return
        }

        if (!userId) {
            console.error("Error: No user ID found in request.");
            res.status(401).json({ message: "Unauthorized: No user ID found" });
            return;
        }

        let validMentions: { userId: mongoose.Types.ObjectId; username: string }[] = [];

        if (mentions && mentions.length > 0) {
            const cleanedMentions = mentions.map((name: string) =>
                name.startsWith("@") ? name.slice(1) : name
            );

            const existingUsers = await User.find({ username: { $in: cleanedMentions } });

            const foundUsernames = existingUsers.map((user) => user.username);
            const invalidMentions = mentions.filter((name: string) => !foundUsernames.includes(name));

            console.log("Valid mentions:", foundUsernames);
            console.log("Invalid mentions:", invalidMentions);

            if (invalidMentions.length > 0) {
                console.error("Invalid mentions detected:", invalidMentions);
                res.status(400).json({ message: `Invalid users: ${invalidMentions.join(", ")}` });
                return;
            }

            validMentions = existingUsers.map((user) => ({
                userId: user._id as mongoose.Types.ObjectId,
                username: user.username,
            }));
        }

        console.log("Final todo data before saving:", {
            title, description, priority, status, tag, mentions: validMentions, user: userId, dueDate: new Date(dueDate)
        });

        const newTodo = new Todo({
            title,
            description,
            priority,
            status,
            tag: Array.isArray(tag) ? tag : tag.split(",").map((t: string) => t.trim()),
            mentions: validMentions,
            user: userId,
            DueDate: new Date(dueDate),
        });

        await newTodo.validate();
        await newTodo.save();

        console.log("Todo saved successfully!");
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error saving todo:", error);
        res.status(500).json({ message: (error as Error).message });
    }
});



const getAllTodos = asyncHandler(async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, priority, status, tag, sortBy = "createdAt", order = "desc" } = req.query;

        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const filter: any = { user: req.user.userId };
        if (priority) filter.priority = priority;
        if (status) filter.status = status;
        if (typeof tag === "string") {
            filter.tag = { $in: tag.split(",") };
        }

        const todos = await Todo.find(filter)
            .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .populate("user", "username email");

        const totalTodos = await Todo.countDocuments(filter);

        res.status(200).json({
            totalTodos,
            totalPages: Math.ceil(totalTodos / Number(limit)),
            currentPage: Number(page),
            todos,
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

const getTodoById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id).populate("user", "username email");

        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

const updateTodo = asyncHandler(async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, tag, mentions, dueDate } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        let todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }

        if (todo.user.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to update this todo" });
            return;
        }

        let validMentions: { userId: mongoose.Types.ObjectId; username: string }[] = [];

        if (mentions && mentions.length > 0) {
            const cleanedMentions = mentions.map((name: string) => name.startsWith("@") ? name.slice(1) : name);
            const existingUsers = await User.find({ username: { $in: cleanedMentions } });

            validMentions = existingUsers.map((user) => ({
                userId: user._id as mongoose.Types.ObjectId,
                username: user.username,
            }));
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            {
                title,
                description,
                priority,
                status,
                tag: Array.isArray(tag) ? tag : tag.split(",").map((t: string) => t.trim()),
                mentions: validMentions,
                dueDate: new Date(dueDate),
            },
            { new: true, runValidators: true }
        );

        console.log("Todo updated successfully!");
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: (error as Error).message });
    }
});


const deleteTodo = asyncHandler(async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }

        if (todo.user.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this todo" });
            return;
        }

        await Todo.findByIdAndDelete(id);

        console.log("Todo deleted successfully!");
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: (error as Error).message });
    }
});


export { createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo }