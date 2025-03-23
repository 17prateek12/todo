import { Input } from '../ui/input';
import { Button } from '../ui/button';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { RegisterUserAPI } from '@/api/ApiCalling';
import { RegisterUser } from '@/lib/interface';

const Register = () => {

    const [formData, setFormData] = useState<RegisterUser>({
        email: '',
        password: '',
        username: '',
        displayname: '',
        confirmPassword: '',
        profilePhoto: ''
    });

    const [error, setError] = useState<string>('');
    const [_isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === "profilePhoto" && files && files.length > 0) {
            setFormData((prevData) => ({
                ...prevData,
                profilePhoto: files[0], // Store the file object
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


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
            const userData = await RegisterUserAPI(formData);
            console.log('User logged in successfully:', userData);
            setIsSubmitting(false);
            toast.success(`Congrats, ${userData.email || 'User'} got register successfully!`);
        } catch (err) {
            setError(err as string || 'An error occurred. Please try again.');
            setIsSubmitting(false);
        }
    }

    return (
        <form className='w-full h-full flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Profile Photo</p>
                <Input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="h-[2.5rem] w-full rounded-xl focus:outline-none"
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Email <span className='text-red-500'>*</span></p>
                <Input
                    type='text'
                    name='email'
                    placeholder='Type your email'
                    value={formData.email}
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Username <span className='text-red-500'>*</span></p>
                <Input
                    type='text'
                    placeholder='Type your username'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Full Name <span className='text-red-500'>*</span></p>
                <Input
                    type='text'
                    placeholder='Type your name'
                    name='displayname'
                    value={formData.displayname}
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Password <span className='text-red-500'>*</span></p>
                <Input
                    type='password'
                    placeholder='Type your password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-[14px]'>Confirm Password <span className='text-red-500'>*</span></p>
                <Input
                    type='password'
                    value={formData.confirmPassword}
                    name='confirmPassword'
                    onChange={handleChange}
                    placeholder='Confirm your password'
                    className='h-[2.5rem] w-full rounded-xl focus:outline-none'
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
                type='submit'
                className='w-full h-[2.5rem] rounded-xl flex items-center justify-center bg-blue-500 text-white text-[14px] hover:bg-blue-300'>
                Register
            </Button>
        </form>
    )
}

export default Register