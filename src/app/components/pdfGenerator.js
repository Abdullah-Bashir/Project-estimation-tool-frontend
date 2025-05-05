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

        const {
            title: projectName = "Untitled Project",
            reports
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
            summary
        } = reports;

        if (!tasks.length) {
            alert("No tasks to export!");
            return;
        }

        const doc = new jsPDF();
        const logo = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);

        // Top black header bar
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, "F");

        // Centered Logo
        doc.addImage(logo, "PNG", 92.5, 5, 25, 25);

        // PM Network text under logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("PM NETWORK ALLIANCE", 105, 35, { align: "center" });

        // Project name
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(projectName, 15, 52);

        // Start Y position for dynamic content
        let nextY = 60;

        // Summary block
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
            nextY += summaryLines.length * 6 + 4;
        }

        // Prediction info
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");

        if (rockSize) {
            if (nextY + 10 > 270) {
                doc.addPage();
                nextY = 20;
            }
            doc.setTextColor(0, 0, 0);
            doc.text("Predicted Size:", 15, nextY);
            doc.setTextColor("#003399");
            doc.text(rockSize, 50, nextY);
            nextY += 10;
        }

        // Use Case (with proper wrapping + page break handling)
        if (useCase) {
            doc.setTextColor(0, 0, 0);
            doc.text("Use Case:", 15, nextY);
            nextY += 6;
            doc.setTextColor("#003399");

            const [summaryPart, examplesPart] = useCase.split("Examples:");

            const wrapAndRender = (label, text) => {
                const lines = doc.splitTextToSize(`${label} ${text.trim()}`, 150);
                const maxY = 270;

                if (nextY + lines.length * 6 > maxY) {
                    doc.addPage();
                    nextY = 20;
                }

                doc.text(lines, 40, nextY);
                nextY += lines.length * 6 + 4;
            };

            if (summaryPart) {
                wrapAndRender("Summary:", summaryPart.replace("Summary:", "").trim());
            }

            if (examplesPart) {
                wrapAndRender("Examples:", examplesPart.trim());
            }
        }

        // Table start
        const tableStartY = nextY + 6;

        const tableData = tasks.map(task => [
            task.title || "-",
            task.department || "-",
            task.hours || "-",
            task.resources || "-",
            task.comment || "-"
        ]);

        autoTable(doc, {
            startY: tableStartY,
            head: [["Title", "Department", "Duration", "Resources", "Comments"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 51, 153], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 15, right: 15 }
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
        doc.text(`Methodology: ${methodology || "-"}`, 15, footerY + 6);
        doc.text(`Pillar: ${pillar || "-"}`, 15, footerY + 12);
        doc.text(`Email: ${email?.trim() || "N/A"}`, 15, footerY + 18);

        // Save
        doc.save("project-estimation-report.pdf");

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Failed to generate PDF. Try again.");
    }
};
