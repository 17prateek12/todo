import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from "express";
import { DecodeToken, AuthenticationRequest } from "../interface/interface";

const validToken = asyncHandler(async (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    //console.log('Auth token', authHeader);

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('Unauthorized - Please login first');
    }
    try {
        token = authHeader.split(" ")[1];
        //console.log('Extract token', token);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodeToken;
        //console.log('Decode token', decoded);
        req.user = { userId: decoded.userId, email: decoded.email, username: decoded.username, displayname: decoded.displayname };
        //console.log('User Assigned to req', req.user);
        next();
    } catch (error) {
        console.log("JWT Verification Error:", (error as Error).message);
        res.status(401);
        throw new Error("Unauthorized - Invalid token");
    }
});

export default validToken;