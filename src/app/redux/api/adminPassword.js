// src/features/api/adminApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = "http://localhost:5000/api/admin";

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({
        // Admin Login
        loginAdmin: builder.mutation({
            query: (password) => ({
                url: '/login',
                method: 'POST',
                body: { password },
            }),
        }),

        // Change Admin Password
        changeAdminPassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => ({
                url: '/change-password',
                method: 'PUT',
                body: { currentPassword, newPassword },
            }),
        }),
    }),
});

export const {
    useLoginAdminMutation,
    useChangeAdminPasswordMutation,
} = adminApi;
