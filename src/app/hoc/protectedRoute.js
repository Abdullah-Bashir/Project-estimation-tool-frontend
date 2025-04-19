"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute(WrappedComponent) {

    return function Wrapper(props) {
        const { data: session, status } = useSession();
        const router = useRouter();
        const [isAuth, setIsAuth] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem("authToken");

            if (status === "loading") {
                // Still loading session, wait
                return;
            }

            if (status === "unauthenticated" && !token) {
                // Not authenticated with Google and no OTP token
                router.push("/login");
            } else {
                // Authenticated
                setIsAuth(true);
            }
        }, [status, router]);

        if (status === "loading") {
            return <div>Loading...</div>; // Optional: customize loading spinner
        }

        if (!isAuth) {
            return null; // Do not show page content until authenticated
        }

        return <WrappedComponent {...props} />;
    };
}
