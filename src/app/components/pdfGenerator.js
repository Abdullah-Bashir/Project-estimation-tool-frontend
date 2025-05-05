"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64ImageFromUrl } from "./base64Image";

export const generatePdf = async () => {
    try {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        if (!currentProject || !currentProject.reports) {
            alert("No project data found!");
            return;
        }

        const { title: projectName = "Untitled Project", reports } = currentProject;
        const { tasks = [], rockSize, useCase, capability, methodology, pillar, email, totalHours, totalResources, summary } = reports;

        if (!tasks.length) {
            alert("No tasks to export!");
            return;
        }

        const doc = new jsPDF();
        const logo = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);

        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, "F");
        doc.addImage(logo, "PNG", 92.5, 5, 25, 25);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("PM NETWORK ALLIANCE", 105, 35, { align: "center" });

        // Project name
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 15, 52);

        let nextY = 60;

        // Summary
        if (summary) {
            doc.setFontSize(11);
            doc.setFont(undefined, "normal");
            doc.setTextColor(80, 80, 80);

            const summaryLines = doc.splitTextToSize(summary, 180);
            if (nextY + summaryLines.length * 6 > 270) {
                doc.addPage();
                nextY = 20;
            }
            doc.text(summaryLines, 15, nextY);
            nextY += summaryLines.length * 6 + 10;
        }

        // Rock Size
        if (rockSize) {
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text("Predicted Size:", 15, nextY);
            doc.setTextColor("#003399");
            doc.text(rockSize, 50, nextY);
            nextY += 10;
        }

        // USE CASE - COMPLETELY FIXED VERSION
        if (useCase) {
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text("Use Case:", 15, nextY);
            nextY += 6;

            // First split by newlines, then split each line to fit page width
            const rawLines = useCase.split('\n');
            let processedLines = [];

            rawLines.forEach(line => {
                const wrappedLines = doc.splitTextToSize(line, 180);
                processedLines = processedLines.concat(wrappedLines);
            });

            doc.setFontSize(10);
            doc.setTextColor("#003399");

            processedLines.forEach(line => {
                if (nextY > 270) {
                    doc.addPage();
                    nextY = 20;
                }
                doc.text(line, 15, nextY);
                nextY += 6;
            });

            nextY += 10;
        }

        // Table
        const tableData = tasks.map(task => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-"
        ]);

        autoTable(doc, {
            startY: nextY,
            head: [["Title", "Department", "Duration", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Duration (Months): ${totalHours || 0}`, 150, finalY);
        doc.text(`Total Resources: ${totalResources || 0}`, 150, finalY + 8);

        doc.setFontSize(10);
        doc.text(`Capability: ${capability || "-"}`, 15, finalY + 20);
        doc.text(`Methodology: ${methodology || "-"}`, 15, finalY + 26);
        doc.text(`Pillar: ${pillar || "-"}`, 15, finalY + 32);
        doc.text(`Email: ${email?.trim() || "N/A"}`, 15, finalY + 38);

        doc.save("project-estimation-report.pdf");

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};