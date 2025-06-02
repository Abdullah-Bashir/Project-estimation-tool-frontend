// pages/adminPanel.tsx
'use client';
import React, { useState } from 'react';
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useGetDropdownOptionsQuery, useUpdateDropdownOptionsMutation } from '@/app/redux/api/dropdownOptionsApi';
import { Loader } from 'lucide-react';
import LoginForm from './components/loginForm';
import ChangePassword from './components/changePassword';
import { ToastContainer } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: 'easeOut'
        }
    })
};

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const router = useRouter()

    const {
        data: options = {
            capability: [],
            pillar: [],
            executiveSponsor: []
        },
        isLoading,
        isError,
        refetch
    } = useGetDropdownOptionsQuery(undefined, { skip: !isAuthenticated });

    const [updateDropdownOptions, { isLoading: isUpdating }] = useUpdateDropdownOptionsMutation();
    const [editing, setEditing] = useState({ field: null, index: null, value: '' });
    const [newItems, setNewItems] = useState({ capability: '', pillar: '', executiveSponsor: '' });

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleAddItem = async (field) => {
        const value = newItems[field].trim();
        if (!value) return alert('Please enter a value');

        try {
            const updatedOptions = { ...options, [field]: [...options[field], value] };
            await updateDropdownOptions(updatedOptions).unwrap();
            setNewItems(prev => ({ ...prev, [field]: '' }));
            refetch();
        } catch (error) {
            console.error('Add Error:', error);
            alert('Failed to add item');
        }
    };

    const handleRemoveItem = async (field, index) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;

        try {
            const updatedOptions = {
                ...options,
                [field]: options[field].filter((_, i) => i !== index)
            };
            await updateDropdownOptions(updatedOptions).unwrap();
            refetch();
        } catch (error) {
            console.error('Remove Error:', error);
            alert('Failed to remove item');
        }
    };

    const handleBack = () => {
        router.push('/');
    };

    const startEditing = (field, index) => {
        setEditing({ field, index, value: options[field][index] });
    };

    const cancelEditing = () => setEditing({ field: null, index: null, value: '' });

    const saveEdit = async () => {
        const value = editing.value.trim();
        if (!value) return alert('Please enter a value');

        try {
            const updatedOptions = {
                ...options,
                [editing.field]: options[editing.field].map((item, i) =>
                    i === editing.index ? value : item
                )
            };
            await updateDropdownOptions(updatedOptions).unwrap();
            cancelEditing();
            refetch();
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update item');
        }
    };

    const renderOptionList = (field, label) => (
        <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
        >
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {label} Options
            </h3>
            <div className="space-y-2 mb-4">
                {options[field].map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        {editing.field === field && editing.index === index ? (
                            <input
                                value={editing.value}
                                onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                                className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-3 py-1 mr-2"
                                autoFocus
                            />
                        ) : (
                            <span className="text-gray-800 dark:text-gray-200">{item}</span>
                        )}
                        <div className="flex gap-2">
                            {editing.field === field && editing.index === index ? (
                                <>
                                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 dark:hover:text-green-400" disabled={isUpdating}>
                                        Save
                                    </button>
                                    <button onClick={cancelEditing} className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400" disabled={isUpdating}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => startEditing(field, index)} className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400" disabled={isUpdating}>
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                            )}
                            <button onClick={() => handleRemoveItem(field, index)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400" disabled={isUpdating}>
                                <FiTrash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder={`Add new ${label.toLowerCase()} option`}
                    value={newItems[field]}
                    onChange={(e) => setNewItems(prev => ({ ...prev, [field]: e.target.value }))}
                    className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-3 py-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(field)}
                    disabled={isUpdating}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddItem(field)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                    disabled={isUpdating || !newItems[field].trim()}
                >
                    <FiPlus className="w-5 h-5" />
                    Add
                </motion.button>
            </div>
        </motion.div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader className="animate-spin" />
        </div>
    );

    if (isError) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                Failed to load options.
            </div>
            <button
                onClick={refetch}
                className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
                <FiRefreshCw className="w-5 h-5" />
                Retry
            </button>
        </div>
    );

    return (
        <motion.div
            className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <ToastContainer />

            {/* Add the ChangePassword modal */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <ChangePassword onClose={() => setShowChangePassword(false)} />
                </div>
            )}

            <div className="max-w-4xl mx-auto">

                {/* Page Heading */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            className="hover:bg-gray-300 bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg"
                            title="Back to Home"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.h1
                            className="text-4xl font-bold text-gray-900 dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Admin Panel
                        </motion.h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChangePassword(true)}
                        className="hover:bg-gray-300 bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg"
                    >
                        Change Password
                    </motion.button>
                </div>
                <motion.p
                    className="text-center text-gray-600 dark:text-gray-400 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Manage dropdown options for your application.
                </motion.p>

                {/* Options Container */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Current Options
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={refetch}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                            disabled={isLoading || isUpdating}
                        >
                            <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </motion.button>
                    </div>

                    {renderOptionList('capability', 'Capability')}
                    {renderOptionList('pillar', 'Pillar')}
                    {renderOptionList('executiveSponsor', 'Executive Sponsor')}
                </div>
            </div>

        </motion.div>
    );
};

export default AdminPanel;