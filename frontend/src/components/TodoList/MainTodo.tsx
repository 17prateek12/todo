import { fetchAllTodo } from '@/api/ApiCalling';
import React, { useState, useEffect } from 'react'
import PendingTodo from './PendingTodo';
import CompleteTodo from './CompleteTodo';

const MainTodo = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = async() =>{
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }
        try {
            const response = await fetchAllTodo(token);
            setTodos(response.data.todos);
        } catch (error) {
            setError(error as string);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const pendingTodos = todos.filter(todo => todo.status === "Pending");
    const completedTodos = todos.filter(todo => todo.status === "Completed");

  return (
    <div className='w-full min-h-screen flex items-center flex-wrap px-4 justify-evenly gap-8 mt-[80px]'>
        <PendingTodo todos={pendingTodos} />
        <CompleteTodo todos={completedTodos} />
    </div>
  )
}

export default MainTodo