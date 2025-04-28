import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../redux/api/authApi"; // adjust path as needed
import { projectDetailApi } from "../redux/api/projectDetailApi"; // adjust path as needed

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [projectDetailApi.reducerPath]: projectDetailApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            projectDetailApi.middleware
        ),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
