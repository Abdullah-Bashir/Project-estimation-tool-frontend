"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function ModalRoot({ children }) {
    const modalRootRef = useRef(null)

    useEffect(() => {
        // Create the modal root element if it doesn't exist
        if (!document.getElementById("modal-root")) {
            const modalRoot = document.createElement("div")
            modalRoot.id = "modal-root"
            document.body.appendChild(modalRoot)
            modalRootRef.current = modalRoot
        } else {
            modalRootRef.current = document.getElementById("modal-root")
        }

        return () => {
            // Clean up only if we created the element
            if (modalRootRef.current && modalRootRef.current.childNodes.length === 0) {
                document.body.removeChild(modalRootRef.current)
            }
        }
    }, [])

    if (!modalRootRef.current) return null

    return createPortal(children, modalRootRef.current)
}
