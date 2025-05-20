"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = async () => {
    try {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        if (!currentProject || !currentProject.reports) {
            alert("No project data found!");
            return;
        }

        const {
            title: projectName = "Untitled Project",
            reports,
        } = currentProject;

        const {
            tasks = [],
            rockSize,
            useCase,
            capability,
            methodology,
            pillar,
            email,
            totalHours,
            totalResources,
            summary,
        } = reports;

        if (!tasks.length) {
            alert("No tasks to export!");
            return;
        }

        const doc = new jsPDF();

        // Project name at the top center
        doc.setFontSize(20);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 105, 20, { align: "center" });

        // Start Y position for dynamic content
        let nextY = 30;

        // Summary block
        if (summary) {
            doc.setFontSize(11);
            doc.setFont(undefined, "normal");
            doc.setTextColor(80, 80, 80);

            const summaryLines = doc.splitTextToSize(summary, 180);
            doc.text(summaryLines, 15, nextY);
            nextY += summaryLines.length * 6 + 4;
        }

        // Prediction info
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        if (rockSize) {
            doc.setTextColor(0, 0, 0);
            doc.text("Predicted Size:", 15, nextY);
            doc.setTextColor("#003399");
            doc.text(rockSize, 50, nextY);
            nextY += 10;
        }

        if (useCase) {
            doc.setTextColor(0, 0, 0);
            doc.text("Use Case:", 15, nextY);
            doc.setTextColor("#003399");

            const exIndex = useCase.indexOf("Ex:");
            if (exIndex !== -1) {
                const beforeEx = useCase.substring(0, exIndex).trim();
                const beforeExLines = doc.splitTextToSize(beforeEx, 150);
                doc.text(beforeExLines, 40, nextY);
                nextY += beforeExLines.length * 6 + 2;

                const exText = useCase.substring(exIndex).trim();
                const exLines = doc.splitTextToSize(exText, 150);
                doc.text(exLines, 40, nextY);
                nextY += exLines.length * 6 + 4;
            } else {
                const allLines = doc.splitTextToSize(useCase, 150);
                doc.text(allLines, 40, nextY);
                nextY += allLines.length * 6 + 4;
            }
        }

        // Table start
        const tableStartY = nextY + 6;

        const tableData = tasks.map((task) => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-",
        ]);

        autoTable(doc, {
            startY: tableStartY,
            head: [["Title", "Department", "Duration", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 },
        });

        // Totals
        const afterTableY = doc.lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        doc.text(`Total Duration (Months): ${totalHours || 0}`, 150, afterTableY);
        doc.text(`Total Resources: ${totalResources || 0}`, 150, afterTableY + 8);

        // Footer
        const footerY = afterTableY + 25;
        doc.setFontSize(10);
        doc.text(`Capability: ${capability || "-"}`, 15, footerY);
        doc.text(`Executive Sponsor: ${methodology || "-"}`, 15, footerY + 6);
        doc.text(`Pillar: ${pillar || "-"}`, 15, footerY + 12);
        doc.text(`Email: ${email?.trim() || "N/A"}`, 15, footerY + 18);

        // Save
        doc.save("project-estimation-report.pdf");
    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};
