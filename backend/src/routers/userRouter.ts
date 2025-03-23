import upload from "../middleware/upload";
import { registerUser, loginuser, logoutUser, getAllUsers, searchUser } from "../controllers/userController";
import express from 'express';
import validToken from "../middleware/validateTokenHandler";

const router = express.Router();

router.route('/register').post(upload.single('profilePhoto'), registerUser);
router.route('/login').post(loginuser);
router.route('/logout').post(validToken,logoutUser);
router.route('/all').get(getAllUsers);
router.route('/search-user').get(searchUser);

export default router