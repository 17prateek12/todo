import React, { useState } from 'react';
import { TodoDetail } from '@/lib/interface';
import TodoCard from './TodoCard';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PendingTodoProps {
    todos: TodoDetail[];
}


const PendingTodo: React.FC<PendingTodoProps> = ({ todos }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 4;

    const totalPages = Math.ceil(todos.length / todosPerPage);
    const startIndex = (currentPage - 1) * todosPerPage;
    const currentTodos = todos.slice(startIndex, startIndex + todosPerPage);
    return (
        <div className='md:w-[400px] w-full h-auto flex items-center justify-center rounded-2xl bg-gray-500'>
            <div className='w-full h-full mx-4 my-4 rounded-2xl px-4 py-3 bg-white'>
                <div className='flex flex-col gap-4'>
                    <p className='text-2xl font-bold text-red-500 text-center'>Pending Task</p>
                    {currentTodos.length > 0 ? (
                        currentTodos.map((todo) => <TodoCard key={todo._id} {...todo} />)
                    ) : (
                        <p className="text-center text-gray-500">No pending todos.</p>
                    )}
                    {
                        totalPages > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <PaginationItem key={i + 1}>
                                            <PaginationLink
                                                href="#"
                                                isActive={i + 1 === currentPage}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default PendingTodo
