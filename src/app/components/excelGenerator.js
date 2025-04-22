import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const generateExcel = async (tasks, rockSize, useCase) => {
    if (!tasks || tasks.length === 0) {
        alert("No tasks to export!");
        return;
    }

    const capability = localStorage.getItem("capability") || "N/A";
    const methodology = localStorage.getItem("methodology") || "N/A";
    const pillar = localStorage.getItem("pillar") || "N/A";
    const email = localStorage.getItem("email") || "N/A";

    const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);
    const totalResources = tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Project Report");

    // Title
    worksheet.mergeCells("A1:E1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Collaborative Rock Sizing Estimator";
    titleCell.font = { size: 18, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([]);

    // ✅ Now properly inserting Predicted Size and Use Case
    worksheet.addRow(["Predicted Size", rockSize]);
    worksheet.addRow(["Use Case", useCase]);
    worksheet.addRow(["Capability", capability]);
    worksheet.addRow(["Pillar", pillar]);
    worksheet.addRow(["Methodology", methodology]);
    worksheet.addRow(["Email Address", email]);

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
            task.comment || "-",
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
    worksheet.addRow(["Total Hours", totalHours]);
    worksheet.addRow(["Total Resources", totalResources]);

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
    worksheet.views = [{ state: "frozen", ySplit: 11 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(file, "project-estimation-report.xlsx");
};
