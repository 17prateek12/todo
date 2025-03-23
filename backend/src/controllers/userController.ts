import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../schemas/userSchema';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, displayname, password, confirmPassword } = req.body;

    if (!email || !username || !displayname || !password || !confirmPassword) {
        res.status(400);
        throw new Error('All field are mandatory');
    };

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400)
        throw new Error('User Already Exist with this email id');
    };

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        res.status(400)
        throw new Error('User Already Exist with this email id');
    };

    if (password !== confirmPassword) {
        res.status(400)
        throw new Error('Password do not match');
    }

    const registrationTime = Date.now().toString();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password + registrationTime, salt);

    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : "https://i.sstatic.net/l60Hf.png";

    const user = await User.create({
        username,
        displayname,
        email,
        profilePhoto,
        password: hashpassword,
        registrationTime
    });

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400)
        throw new Error('User Data is not valid');
    }
});

const loginuser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('All field are mandatory');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid Email or Password');
    }

    const registrationTime = user.registrationTime || '';

    const isMatch = await bcrypt.compare(password + registrationTime, user.password);

    if (isMatch) {
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, username: user.username, displayname: user.displayname },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '7d' }
        );
        res.status(200).json({
            'accessToken': accessToken,
            'userId': user.id,
            'userEmail': user.email,
            'username': user.username,
            'displayname': user.displayname,
            'profilePhoto': user.profilePhoto
        });
    } else {
        res.status(401);
        throw new Error('Invalid Password or Email');
    }
});

const logoutUser = asyncHandler(async (req:Request, res:Response) => {
    try {
        res.status(200).json({
            message: "User logged out successfully",
            accessToken: null
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to log out");
    }
});

const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}, "username email");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

const searchUser =  asyncHandler(async (req:Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;

      if (!query) {
        res.status(400).json({ message: "Query parameter is required" });
        return; 
      }

      const users = await User.find({ username: { $regex: query, $options: "i" } })
        .limit(10)
        .select("username _id email");

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  })

export { registerUser, loginuser, logoutUser, getAllUsers, searchUser }