'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (data: any) => {
        console.log('Submitting registration data:', data);
        setError(''); // Clear previous errors
        try {
            const res = await api.post('/auth/register', data);
            console.log('Registration successful:', res.data);
            if (res.data.access_token) {
                localStorage.setItem('token', res.data.access_token);
                router.push('/');
            } else {
                setError('Registration successful but no token received.');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            // Detailed error message
            const msg = err.response?.data?.message
                ? (Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message)
                : err.message || 'Registration failed';
            setError(msg);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                type="text"
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Full Name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 px-3">{errors.name.message as string}</p>}
                        </div>
                        <div>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 px-3">{errors.email.message as string}</p>}
                        </div>
                        <div>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                type="password"
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 px-3">{errors.password.message as string}</p>}
                        </div>
                    </div>

                    <div className="text-red-500 text-sm text-center">{error}</div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div >
        </div >
    );
}
