import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { projectDetailApi } from "./api/projectDetailApi";
import { dropdownOptionsApi } from "./api/dropdownOptionsApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [projectDetailApi.reducerPath]: projectDetailApi.reducer,
        [dropdownOptionsApi.reducerPath]: dropdownOptionsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            projectDetailApi.middleware,
            dropdownOptionsApi.middleware
        ),
    devTools: process.env.NODE_ENV !== "production",
});

export default store;