import { Input } from '../ui/input'
import { Button } from '../ui/button'
import React, { useState } from 'react'
import { LoginUser } from '@/lib/interface';
import { useNavigate } from 'react-router-dom';
import { loginUserAPI } from '@/api/ApiCalling';
import {  toast } from 'react-toastify';

const Login = () => {

    const [formData, setFormData] = useState<LoginUser>({
        email: '',
        password: '',
    });

    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Both fields are required');
            setIsSubmitting(false);
            return;
        }
        try {
            const userData = await loginUserAPI(formData);
            console.log('User logged in successfully:', userData);
            setIsSubmitting(false);
            navigate('/home');
            toast.success(`Congrats, Welcome back ${userData.displayname || 'User'}!`);
        } catch (err) {
            setError(err as string || 'An error occurred. Please try again.');
            setIsSubmitting(false);
        }
    }


    return (
        <form className='w-full h-full flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Email <span className='text-red-500'>*</span></p>
                <Input
                    type='text'
                    name='email'
                    value={formData.email}
                    placeholder='Type your email'
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Password <span className='text-red-500'>*</span></p>
                <Input
                    type='password'
                    name='password'
                    value={formData.password}
                    placeholder='Type your password'
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full h-[2.5rem] rounded-xl flex items-center justify-center bg-blue-500 text-white text-[14px] hover:bg-blue-300'>
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>
        </form>
    )
}

export default Login