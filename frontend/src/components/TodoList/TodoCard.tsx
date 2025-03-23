import { TodoDetail } from '@/lib/interface'
import React from 'react'
import { Button } from '../ui/button'
import { deleteTodo } from '@/api/ApiCalling'
import { Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { ScanEye } from 'lucide-react';
import ViewTodo from '../TodoManage/ViewTodo';


const TodoCard: React.FC<TodoDetail> = ({ title, description, priority, tag, status, mentions, DueDate, _id }) => {

    const token = localStorage.getItem('accessToken') as string;

    const handleDelete = async() =>{
        const id =_id;
        try {
            await deleteTodo(id,token);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog>
        <div className='w-full h-auto rounded-2xl bg-violet-400 flex items-center'>
            <div className='w-full h-full mx-4 my-4 rounded-2xl bg-gray-200 '>
                <div className='flex flex-col gap-2 p-2'>
                    <div className='w-full flex justify-between items-center'>
                    <p className='text-[16px] font-semibold'>{title}</p>
                    <div className='flex items-center gap-2'>
                        <Button variant={'outline'} onClick={handleDelete} className='bg-transparent'>
                            <Trash className='text-red-500' />
                        </Button>
                        <DialogTrigger>
                        <Button variant={'outline'} className='bg-transparent'>
                            <ScanEye className='text-gray-500' />
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <ViewTodo id={_id} token={token} />
                        </DialogContent>
                    </div>
                    </div>
                    <p className='text-[12px] font-normal text-wrap'>{description}</p>
                    <div className='flex flex-wrap items-center gap-4'>
                        <Button className={`w-auto h-auto px-2 py-1 flex items-center justify-center rounded-lg
                    ${priority === 'High' ? 'bg-red-500' :
                                priority === 'Low' ? 'bg-yellow-400' : 'bg-orange-400'}`}>{priority}</Button>
                        <Button className={`w-auto h-auto px-2 py-1 flex items-center justify-center rounded-lg
                    ${status === 'Pending' ? 'bg-red-500' : 'bg-green-400'}`}>
                            {status}</Button>
                    </div>
                    <div className='flex items-center gap-2'>
                    {tag.map((item, index) => (
                        <Button key={index} className='w-auto h-auto px-2 py-1 bg-blue-400 text-white text-[10px] flex items-center justify-center rounded-lg'>
                            {item}
                        </Button>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        </Dialog>
    )
}

export default TodoCard