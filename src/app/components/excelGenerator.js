"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const generateExcel = async () => {
    try {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        if (!currentProject || !currentProject.reports) {
            alert("No project data found!");
            return;
        }

        const { title: projectName = "Untitled Project", reports } = currentProject;
        const { tasks = [], rockSize, useCase, capability, methodology, pillar, email, totalHours, totalResources } = reports;

        if (!tasks.length) {
            alert("No tasks to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Project Report");

        // Title
        worksheet.mergeCells("A1:E1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = "Collaborative Rock Sizing Estimator";
        titleCell.font = { size: 18, bold: true };
        titleCell.alignment = { vertical: "middle", horizontal: "center" };

        worksheet.addRow([]);

        // Predicted Size and Use Case
        worksheet.addRow(["Project Name", projectName]);
        worksheet.addRow(["Predicted Size", rockSize]);

        const [summaryPart, examplesPart] = useCase.split("Examples:");
        worksheet.addRow(["Summary", summaryPart ? summaryPart.replace("Summary:", "").trim() : "-"]);
        worksheet.addRow(["Examples", examplesPart ? examplesPart.trim() : "-"]);

        worksheet.addRow(["Capability", capability || "N/A"]);
        worksheet.addRow(["Pillar", pillar || "N/A"]);
        worksheet.addRow(["Methodology", methodology || "N/A"]);
        worksheet.addRow(["Email Address", email || "N/A"]);

        worksheet.addRow([]);
        worksheet.addRow(["Tasks"]);

        const headerRow = worksheet.addRow(["Title", "Department", "Hours", "Resources", "Comments"]);

        // Style header
        headerRow.eachCell(cell => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF003399" },
            };
            cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // Add tasks
        tasks.forEach((task, index) => {
            const row = worksheet.addRow([
                task.title || "-",
                task.department || "-",
                task.hours || "-",
                task.resources || "-",
                task.comment || "-"
            ]);

            if (index % 2 === 1) {
                row.eachCell(cell => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFE6F0FF" },
                    };
                });
            }

            row.eachCell(cell => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.font = { size: 11 };
            });
        });

        worksheet.addRow([]);
        worksheet.addRow(["Total Hours", totalHours || 0]);
        worksheet.addRow(["Total Resources", totalResources || 0]);

        // Auto width
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : "";
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength < 20 ? 20 : maxLength + 5;
        });

        // Freeze header
        worksheet.views = [{ state: "frozen", ySplit: 12 }]; // ySplit is rows to freeze (title + project info + task header)

        const buffer = await workbook.xlsx.writeBuffer();
        const file = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(file, "project-estimation-report.xlsx");

    } catch (error) {
        console.error("Excel generation error:", error);
        alert("Failed to generate Excel. Please try again.");
    }
};
