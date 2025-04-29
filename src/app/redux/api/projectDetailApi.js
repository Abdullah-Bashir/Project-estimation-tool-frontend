import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = "https://project-estimation-tool-backend-production.up.railway.app/api/projects";  // Backend URL

export const projectDetailApi = createApi({
    reducerPath: 'projectDetailApi',  // The name of the slice in the Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,  // Base URL for API requests
    }),

    endpoints: (builder) => ({

        // 1️⃣ Create or update project
        createOrUpdateProject: builder.mutation({
            query: (projectData) => {
                const { _id } = projectData;  // Check if the project already has an _id
                const url = _id ? `/${_id}` : '/';  // If _id exists, it's an update; otherwise, create new project
                const method = _id ? 'PUT' : 'POST';  // Use PUT for update, POST for new project

                return {
                    url,
                    method,
                    body: projectData,  // Send the project data as the request body
                };
            },
        }),


        // 2️⃣ Get all projects
        getAllProjects: builder.query({
            query: () => ({
                url: '/',
                method: 'GET',
            }),
            transformResponse: (response) => response.data, // Transform response data
        }),


        // 3️⃣ Get project by ID
        getProjectById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
        }),


        // 🛠 Add inside endpoints
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),


        // 4️⃣ Update project by ID (if needed)
        updateProject: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updatedData,  // Send the updated project data
            }),
        }),
    }),
});

export const {
    useCreateOrUpdateProjectMutation,  // Hook for create or update project
    useGetAllProjectsQuery,  // Hook for getting all projects
    useGetProjectByIdQuery,  // Hook for getting a project by ID
    useUpdateProjectMutation,  // Hook for updating a project
    useDeleteProjectMutation,
} = projectDetailApi;
