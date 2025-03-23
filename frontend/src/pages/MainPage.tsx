import React from 'react';
import NavBar from '@/components/Navbar/NavBar';
import MainTodo from '@/components/TodoList/MainTodo';

const MainPage = () => {
  return (
    <div className='w-full min-h-screen bg-gray-200'>
        <NavBar />
        <MainTodo />
    </div>
  )
}

export default MainPage