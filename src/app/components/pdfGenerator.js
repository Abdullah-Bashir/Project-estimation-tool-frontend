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

        // First page header
        doc.setFontSize(20);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 105, 20, { align: "center" });

        let nextY = 30;

        // Summary block (only on first page)
        if (summary) {
            doc.setFontSize(11);
            doc.setFont(undefined, "normal");
            doc.setTextColor(80, 80, 80);
            const summaryLines = doc.splitTextToSize(summary, 180);
            doc.text(summaryLines, 15, nextY);
            nextY += summaryLines.length * 6 + 4;
        }

        // Table data
        const tableData = tasks.map((task) => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-",
        ]);

        // Function to draw header content (used for all pages)
        const drawHeaderContent = (yPos) => {
            let currentY = yPos;
            
            // Predicted Size
            if (rockSize) {
                doc.setFontSize(11);
                doc.setFont(undefined, "normal");
                doc.setTextColor(0, 0, 0);
                doc.text("Predicted Size:", 15, currentY);
                doc.setTextColor("#003399");
                doc.text(rockSize, 50, currentY);
                currentY += 6;
            }

            // Use Case
            if (useCase) {
                doc.setFontSize(11);
                doc.setFont(undefined, "normal");
                doc.setTextColor(0, 0, 0);
                doc.text("Use Case:", 15, currentY);
                doc.setTextColor("#003399");

                const exIndex = useCase.indexOf("Ex:");
                let lines = [];

                if (exIndex !== -1) {
                    const beforeEx = useCase.substring(0, exIndex).trim();
                    const exText = useCase.substring(exIndex).trim();
                    lines = doc.splitTextToSize(beforeEx + "\n" + exText, 150);
                } else {
                    lines = doc.splitTextToSize(useCase, 150);
                }

                doc.text(lines, 40, currentY);
                currentY += lines.length * 6;
            }

            return currentY + 10; // Add extra space before table
        };

        // Draw header content for first page
        const firstPageTableStartY = drawHeaderContent(nextY);

        // Render table with custom header for subsequent pages
        autoTable(doc, {
            startY: firstPageTableStartY,
            head: [["Title", "Department", "Duration", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 , top:60 },
            didDrawPage: (data) => {
                // For all pages after the first
                if (data.pageNumber > 1) {
                    // Reset to top of page
                    let headerY = 20;
                    
                    // Project title
                    doc.setFontSize(20);
                    doc.setFont(undefined, "bold");
                    doc.setTextColor(0, 0, 0);
                    doc.text(projectName, 105, headerY, { align: "center" });
                    headerY += 10;

                    // Draw header content and update table start position
                    data.table.startY = drawHeaderContent(headerY);
                }
            }
        });

        // Totals below table
        const afterTableY = doc.lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        doc.text(`Total Duration (Months): ${totalHours || 0}`, 150, afterTableY);
        doc.text(`Total Resources: ${totalResources || 0}`, 150, afterTableY + 8);

        // Footer info
        const footerY = afterTableY + 25;
        doc.setFontSize(10);
        doc.text(`Capability: ${capability || "-"}`, 15, footerY);
        doc.text(`Executive Sponsor: ${methodology || "-"}`, 15, footerY + 6);
        doc.text(`Pillar: ${pillar || "-"}`, 15, footerY + 12);
        doc.text(`Email: ${email?.trim() || "N/A"}`, 15, footerY + 18);

        doc.save("project-estimation-report.pdf");
    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};