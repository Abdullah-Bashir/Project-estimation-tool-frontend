"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react"; // import signIn from next-auth
import { useLoginUserMutation } from "@/app/redux/api/authApi";
import ThemeToggle from "@/app/components/ThemeToggle";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Credentials login still uses your backend API
            const response = await loginUser({ email, password }).unwrap();
            localStorage.setItem("authToken", response.token);
            toast.success(response.message || "Logged in successfully!");
            router.push("/");
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.data?.message || "Login failed");
        }
    };

    // Social login via NextAuth
    const handleSocialLogin = (provider) => {
        // signIn() triggers NextAuth’s provider flow.
        // You can also pass a callbackUrl if you want to control the landing page after login.
        signIn(provider, { callbackUrl: `${window.location.origin}/auth/success` });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 text-white transition-all duration-300 relative px-4">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Login to AuthApp
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full text-black px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-4 text-black py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="flex items-center justify-center my-6">
                    <span className="border-b border-gray-300 w-1/5"></span>
                    <span className="px-3 text-gray-500">or</span>
                    <span className="border-b border-gray-300 w-1/5"></span>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={() => handleSocialLogin("google")}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-2 rounded-md border border-gray-300 transition duration-300"
                    >
                        <FcGoogle className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </button>
                    <button
                        onClick={() => handleSocialLogin("github")}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md transition duration-300"
                    >
                        <FaGithub className="w-5 h-5" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
