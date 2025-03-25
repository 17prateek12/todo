import { getTodoById } from '@/api/ApiCalling';
import { TodoDetail } from '@/lib/interface';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Loader2, CalendarDays, MessageSquare } from 'lucide-react';
import { format } from "date-fns";
import TodoNotes from './TodoNotes';

const ViewTodo = ({ id, token }: { id: string; token: string }) => {
    const [todo, setTodo] = useState<TodoDetail | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const fetchDetailTodo = useCallback(async () => {
        try {
            const data = await getTodoById(id, token);
            setTodo(data);
        } catch (error) {
            console.error(error);
        }
    }, [id, token]);

    useEffect(() => {
        fetchDetailTodo();
    }, [fetchDetailTodo]);

    if (!todo) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
                <span className="ml-2 text-gray-500">Loading...</span>
            </div>
        );
    }

    const formatDateTime = (isoString: string): string => {
        return format(new Date(isoString), "MMMM dd, yyyy hh:mm a");
    };

    return (
        <div className="max-w-2xl  mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6 border overflow-scroll">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900">{todo.title}</h2>
            <p className="text-gray-700 text-lg">{todo.description}</p>

            {/* Status & Priority */}
            <div className="flex flex-wrap gap-3">
                <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                        todo.priority === 'High' ? 'bg-red-500' :
                        todo.priority === 'Medium' ? 'bg-orange-400' : 'bg-yellow-400'
                    }`}
                >
                    {todo.priority}
                </span>

                <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                        todo.status === 'Pending' ? 'bg-orange-500' : 
                        todo.status === 'Overdue' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                >
                    {todo.status}
                </span>
            </div>

            {/* Mentions */}
            {todo.mentions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Mentions</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {todo.mentions.map((item, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm shadow">
                                @{item.username}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {todo.tag.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {todo.tag.map((item, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm shadow">
                                #{item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Due Date */}
            <p className="text-sm text-gray-600 flex items-center gap-2">
                <CalendarDays className="text-blue-500" /> 
                <span className="font-medium">Due Date: {formatDateTime(todo.dueDate)}</span>
            </p>

            {/* Notes Toggle Button */}
            <div className="flex justify-end">
                <Button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition-all"
                >
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <span>{showDetails ? "Hide Notes" : "View Notes"}</span>
                </Button>
            </div>

            {/* Notes Section */}
            {showDetails && (
                <div className="mt-5 border-t pt-4 overflow-scroll">
                    <TodoNotes todoId={todo._id} token={token} />
                </div>
            )}
        </div>
    );
};

export default ViewTodo;

