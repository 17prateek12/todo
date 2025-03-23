import { Button } from '../ui/button';
import { Input } from '../ui/input';
import DropPicMenu from './DropPicMenu';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import CreateTodo from '../TodoManage/CreateTodo';

const NavBar = () => {

       
  return ( 
    <Dialog>
    <div className='flex items-center justify-evenly w-full h-[80px] bg-white fixed top-0 px-8 gap-4'>
        <p className='text-base lg:text-2xl text-black font-bold'>TODO</p>
        <div className='w-[90%] md:w-[380px] h-[2.5rem] rounded-xl overflow-hidden border border-gray-200'>
            <Input
            type='text'
            placeholder='search'
            className='w-full h-full focus:outline-none border-none text-[14px]' />
        </div>
        <DialogTrigger asChild>
        <Button className='px-4 py-2 flex items-center justify-center border border-gray-200 text-black text-sm rounded-2xl 
        hover:bg-gray-800 hover:text-white bg-white'>
            <Plus />{" "}Add Todo
        </Button>
        </DialogTrigger>
        <DialogContent className='md:w-[600px] w-[90%]'>
            <CreateTodo />
        </DialogContent>
        <DropPicMenu />  
    </div>
    </Dialog>
  )
}

export default NavBar