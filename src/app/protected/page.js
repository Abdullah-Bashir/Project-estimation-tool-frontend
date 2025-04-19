// app/protected/page.js
"use client";

import ProtectedRoute from "@/app/hoc/protectedRoute";

function ProtectedPage() {
    return (
        <div>
            <h1>I am Protected</h1>
        </div>
    );
}

export default ProtectedRoute(ProtectedPage);
