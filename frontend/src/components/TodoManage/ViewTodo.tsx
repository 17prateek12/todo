import { getTodoById } from '@/api/ApiCalling';
import { TodoDetail } from '@/lib/interface';
import { useState, useEffect } from 'react'
import { Button } from '../ui/button';

const ViewTodo = ({ id, token }: { id: string, token: string }) => {

    const [todo, setTodo] = useState<TodoDetail | null>(null);
    console.log('Select todo', id, token)

    useEffect(() => {
        const fetchDetailTodo = async () => {
            try {
                const data = await getTodoById(id, token)
                setTodo(data)
            } catch (error) {
                console.error(error);
            }
        };
        fetchDetailTodo();
    }, [id, todo]);

    if (!todo) return <p>Loading...</p>;

    return (
        <>
            {todo && (
                <div className='md:w-[600px] w-full px-8 py-12 flex flex-col gap-4'>
                    <p className='text-3xl font-bold text-black'>{todo.title}</p>
                    <p className='text-base font-normal'>{todo.description}</p>
                    <div className='flex items-center gap-4'>
                        <Button className={`w-auto h-auto px-2 py-1 flex items-center justify-center rounded-lg
                ${todo.priority === 'High' ? 'bg-red-500' :
                                todo.priority === 'Low' ? 'bg-yellow-400' : 'bg-orange-400'}`}>
                            {todo.priority}
                        </Button>
                        <Button className={`w-auto h-auto px-2 py-1 flex items-center justify-center rounded-lg
                ${todo.status === 'Pending' ? 'bg-red-500' : 'bg-green-400'}`}>
                            {todo.status}
                        </Button>
                    </div>
                    <div className='w-full flex items-center flex-wrap'>
                        {todo?.mentions?.map((item, index) => (
                            <Button key={index} className='px-4 py-2 bg-gray-200 text-black font-medium'>
                                {item.username}
                            </Button>
                        ))}
                    </div>
                    <div className='w-full flex items-center flex-wrap'>
                        {todo?.tag?.map((item, index) => (
                            <Button key={index} className='px-4 py-2 bg-gray-200 text-black font-medium'>
                                {item}
                            </Button>
                        ))}
                    </div>
                    <p>{new Date(todo.DueDate).toLocaleDateString()}</p>
                </div>
            )}

        </>
    )
}

export default ViewTodo