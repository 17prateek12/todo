import express from 'express';
import validToken from "../middleware/validateTokenHandler";
import { createTodo, getAllTodos, getTodoById,updateTodo, deleteTodo, addNoteToTodo, getTodoNotes, deleteNote } from '../controllers/todoController';

const router = express.Router();

router.route('/create-todo').post(validToken, createTodo);
router.route('/todo').get(validToken, getAllTodos);
router.route('/todo/:id').get(validToken, getTodoById);
router.route('/todo/:id').patch(validToken, updateTodo);
router.route('/todo/:id').delete(validToken, deleteTodo);
router.route('/todo/:todoId/notes').post(validToken, addNoteToTodo);
router.route('/todo/:todoId/notes').get(getTodoNotes);
router.route('/todo/notes/:noteId').delete(validToken, deleteNote);

export default router;