"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64ImageFromUrl } from "./base64Image";

export const generatePdf = async () => {
    try {
        // 1. Get project data
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));
        if (!currentProject?.reports) {
            alert("No project data found!");
            return;
        }

        // 2. Prepare data
        const { title: projectName = "Untitled Project", reports } = currentProject;
        const { tasks = [], rockSize, useCase, capability, methodology, pillar, email, totalHours, totalResources, summary } = reports;

        if (!tasks.length) {
            alert("No tasks to export!");
            return;
        }

        // 3. Initialize PDF
        const doc = new jsPDF();
        const logo = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);

        // ===== HEADER SECTION =====
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, "F");
        doc.addImage(logo, "PNG", 92.5, 5, 25, 25);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("PM NETWORK ALLIANCE", 105, 35, { align: "center" });

        // ===== PROJECT INFO =====
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 15, 52);

        let nextY = 60;

        // ===== SUMMARY SECTION =====
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

        // ===== ROCK SIZE =====
        if (rockSize) {
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text("Predicted Size:", 15, nextY);
            doc.setTextColor("#003399");
            doc.text(rockSize, 50, nextY);
            nextY += 10;
        }

        // ===== USE CASE SECTION (100% WORKING VERSION) =====
        if (useCase) {
            // Save settings
            const prevFont = doc.getFont();
            const prevSize = doc.getFontSize();
            const prevColor = doc.getTextColor();

            // Label
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text("Use Case:", 15, nextY);
            nextY += 6;

            // Content
            doc.setFontSize(10);
            doc.setTextColor("#003399");

            // Process each paragraph
            const paragraphs = useCase.split('\n');
            for (const para of paragraphs) {
                // Split into lines that fit page width
                const lines = doc.splitTextToSize(para, 180);

                for (const line of lines) {
                    if (nextY > 270) {
                        doc.addPage();
                        nextY = 20;
                    }
                    doc.text(line, 15, nextY);
                    nextY += 6;
                }

                // Add space between paragraphs
                nextY += 2;
            }

            // Restore settings
            doc.setFont(prevFont);
            doc.setFontSize(prevSize);
            doc.setTextColor(prevColor);
            nextY += 10;
        }

        // ===== TASKS TABLE =====
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

        // ===== FOOTER SECTION =====
        const finalY = doc.lastAutoTable.finalY + 10;

        // Totals
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Duration (Months): ${totalHours || 0}`, 150, finalY);
        doc.text(`Total Resources: ${totalResources || 0}`, 150, finalY + 8);

        // Metadata
        doc.setFontSize(10);
        doc.text(`Capability: ${capability || "-"}`, 15, finalY + 20);
        doc.text(`Methodology: ${methodology || "-"}`, 15, finalY + 26);
        doc.text(`Pillar: ${pillar || "-"}`, 15, finalY + 32);
        doc.text(`Email: ${email?.trim() || "N/A"}`, 15, finalY + 38);

        // ===== SAVE PDF =====
        doc.save(`${projectName.replace(/[^a-z0-9]/gi, '_')}_report.pdf`);

    } catch (error) {
        console.error("PDF generation error:", error);
        alert(`PDF generation failed: ${error.message}`);
    }
};