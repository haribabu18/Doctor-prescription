'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignInAlt, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.refresh();
                router.push('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error - check console');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto flex-grow flex items-center justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col gap-15 w-80">
                    <div className="flex flex-col gap-2 items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Login</h1>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                        <input className="p-2 rounded-md border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                        />
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input className="p-2 rounded-md w-full border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <button type="button" onClick={() => {
                                const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                                if (passwordInput) {
                                    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                                }
                            }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                <FaEyeSlash />
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="text-blue-500 text-sm md:text-lg justify-between flex items-center gap-2 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white transition-all duration-300">
                        Login
                        <span className="float-right"><FaSignInAlt /></span></button>
                </form>
            </div>
        </div>
    );
}