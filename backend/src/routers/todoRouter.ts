import express from 'express';
import validToken from "../middleware/validateTokenHandler";
import { createTodo, getAllTodos, getTodoById,updateTodo, deleteTodo } from '../controllers/todoController';

const router = express.Router();

router.route('/create-todo').post(validToken, createTodo);
router.route('/todo').get(validToken, getAllTodos);
router.route('/todo/:id').get(validToken, getTodoById);
router.route('/todo/:id').put(validToken, updateTodo);
router.route('/todo/:id').delete(validToken, deleteTodo);

export default router;