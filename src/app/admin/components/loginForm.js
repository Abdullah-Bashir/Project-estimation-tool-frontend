import React, { useState } from 'react';
import { useLoginAdminMutation } from '@/app/redux/api/adminPassword';

const LoginForm = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [loginAdmin, { isLoading, isError }] = useLoginAdminMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginAdmin(password).unwrap();
            onLoginSuccess();
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="w-[400px] mx-auto  p-8 bg-white rounded-xl shadow-xl font-sans">
            <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
                🔒 Admin Login
            </h2>
            <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-md text-white text-base font-medium transition duration-200
                        ${isLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {isError && (
                    <p className="text-red-500 text-center mt-4 font-medium">
                        ❌ Login failed. Please try again.
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
