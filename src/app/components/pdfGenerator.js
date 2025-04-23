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
        doc.rect(0, 0, 210, 40, 'F'); // full width black rectangle

        // Logo in center
        doc.addImage(logo, "PNG", 75, 5, 60, 15);

        // Company name below logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("PM NETWORK ALLIANCE", 105, 25, { align: "center" });

        // Project title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text(projectName, 15, 55);

        // Predicted Size & Use Case
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("Predicted Size:", 15, 65);
        doc.setTextColor("#003399");
        doc.text(rockSize, 55, 65);

        doc.setTextColor(0, 0, 0);
        doc.text("Use Case:", 15, 73);
        doc.setTextColor("#003399");
        doc.text(useCase, 40, 73);

        // Table
        const tableData = tasks.map(task => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-"
        ]);

        autoTable(doc, {
            startY: 80,
            head: [["Title", "Department", "Hours", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 }
        });

        // Total hours/resources - align to right bottom of table
        const afterTableY = doc.lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Total Hours: ${totalHours}`, 150, afterTableY);
        doc.text(`Total Resources: ${totalResources}`, 150, afterTableY + 8);

        // Footer info
        const footerY = afterTableY + 25;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
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
