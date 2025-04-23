"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64ImageFromUrl } from "./base64Image";

export const generatePdf = async (tasks, rockSize, useCase) => {
    if (!tasks || tasks.length === 0) {
        alert("No tasks to export!");
        return;
    }

    if (!rockSize || !useCase) {
        alert("Please calculate rock size first!");
        return;
    }

    try {
        const doc = new jsPDF();
        const logo = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);

        const capability = localStorage.getItem("capability") || "Maintain (Keep lights on)";
        const methodology = localStorage.getItem("methodology") || "Agile";
        const pillar = localStorage.getItem("pillar") || "Organizational & Staff";
        const email = localStorage.getItem("email") || "itsmeyere";
        const projectName = localStorage.getItem("projectName") || "Tekken 7";

        const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);
        const totalResources = tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0);

        // Top black header bar
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');

        // Square logo in center
        doc.addImage(logo, "PNG", 92.5, 5, 25, 25); // square logo (25x25)

        // Header text under logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("PM NETWORK ALLIANCE", 105, 35, { align: "center" });

        // Project name
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 15, 52);

        // Prediction info: compact, inline
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        doc.setTextColor(0, 0, 0);
        doc.text("Predicted Size:", 15, 60);
        doc.setTextColor("#003399");
        doc.text(rockSize, 50, 60);

        doc.setTextColor(0, 0, 0);
        doc.text("Use Case:", 15, 67);
        doc.setTextColor("#003399");
        doc.text(useCase, 40, 67);

        // Table
        const tableData = tasks.map(task => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-"
        ]);

        autoTable(doc, {
            startY: 75,
            head: [["Title", "Department", "Hours", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 }
        });

        // Total summary
        const afterTableY = doc.lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        doc.text(`Total Hours: ${totalHours}`, 150, afterTableY);
        doc.text(`Total Resources: ${totalResources}`, 150, afterTableY + 8);

        // Footer info
        const footerY = afterTableY + 25;
        doc.setFontSize(10);
        doc.text(`Capability: ${capability}`, 15, footerY);
        doc.text(`Methodology: ${methodology}`, 15, footerY + 6);
        doc.text(`Pillar: ${pillar}`, 15, footerY + 12);
        doc.text(`Email: ${email}`, 15, footerY + 18);

        doc.save("project-estimation-report.pdf");
    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};
