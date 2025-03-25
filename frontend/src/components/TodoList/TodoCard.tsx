import { TodoDetail } from '@/lib/interface'
import React, { useState } from 'react'
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
import { PencilLine } from 'lucide-react';
import UpdateCreateTodo from '../TodoManage/UpdateCreateTodo';



const TodoCard: React.FC<TodoDetail> = ({ title, description, _id, user, priority, status, dueDate, mentions, tag }) => {

    const token = localStorage.getItem('accessToken') as string;
    const creator = localStorage.getItem('username') as string;
    const [selectedTodo, setSelectedTodo] = useState<TodoDetail | undefined>(undefined);

    const handleEdit = () => {
        setSelectedTodo({
            title,
            description,
            _id,
            user,
            priority,
            status,
            tag,
            dueDate,
            mentions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    };

    const handleDelete = async () => {
        const id = _id;
        try {
            await deleteTodo(id, token);
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <div className={`w-full h-auto rounded-2xl text-white shadow flex items-center
             ${status === 'Pending' ? 'bg-orange-500' : 
                        status=== 'Overdue' ? 'bg-red-500' : 'bg-green-500'}`}>
            <div className='flex flex-col gap-2 px-4 py-4 w-full'>
                <div className='w-full flex justify-between items-center'>
                    <p className='text-[16px] font-semibold'>{title}</p>
                    <div className='flex items-center'>
                        {creator === user.username ?
                            (
                                <>
                                    <Button variant={'outline'} onClick={handleDelete} className='bg-transparent hover:bg-transparent border-none shadow-none'>
                                        <Trash className='text-white' />
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button onClick={handleEdit}
                                                className='bg-transparent hover:bg-transparent border-none shadow-none' variant={'outline'} >
                                                <PencilLine className='text-white' />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <UpdateCreateTodo isUpdatingTodo={true} existingTodo={selectedTodo} />
                                        </DialogContent>    </Dialog>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        <Dialog>
                            <DialogTrigger>
                                <Button variant={'outline'} className='bg-transparent hover:bg-transparent shadow-none border-none'>
                                    <ScanEye className='text-white' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='h-[600px]'>
                                <ViewTodo id={_id} token={token} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <p className={`text-[12px] font-normal text-wrap ${description === '' ? 'hidden' : 'block'}`}>{description}</p>
                {creator === user.username ? (
                    <p className='text-[12px] font-semibold'>Created by {user.username}</p>
                ) : (
                    <p className='text-[12px] font-semibold'>Mention by {user.username}</p>
                )}
                {/*<div className='flex flex-wrap items-center gap-4'>
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
                    </div> */}
            </div>
        </div>

    )
}

export default TodoCard