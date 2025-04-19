'use client';

import { useEffect } from "react";

export default function LordIconScript() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.lordicon.com/lordicon.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}
