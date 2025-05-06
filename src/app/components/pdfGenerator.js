"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64ImageFromUrl } from "./base64Image";

// Helper function to safely convert to string
const safeString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

export const generatePdf = async () => {
  try {
    // 1. Safely get and validate project data
    const currentProject = JSON.parse(localStorage.getItem("currentProject") || "{}");
    
    if (!currentProject?.reports) {
      alert("No project data found!");
      return;
    }

    // 2. Prepare data with type-safe defaults
    const {
      title = "Untitled Project",
      reports = {
        tasks: [],
        rockSize: "",
        useCase: "",
        capability: "",
        methodology: "",
        pillar: "",
        email: "",
        totalHours: 0,
        totalResources: 0,
        summary: ""
      }
    } = currentProject;

    const {
      tasks,
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

    // 3. Initialize PDF with proper metadata
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // ===== HEADER SECTION =====
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, "F");
    
    try {
      const logo = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);
      doc.addImage(logo, "PNG", 92.5, 5, 25, 25);
    } catch (e) {
      console.warn("Logo not loaded, continuing without it");
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("PM NETWORK ALLIANCE", 105, 35, { align: "center" });

    // ===== PROJECT INFO =====
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(safeString(title), 15, 52);

    let currentY = 60;

    // ===== SUMMARY SECTION =====
    if (summary) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);

      const summaryText = safeString(summary);
      const summaryLines = doc.splitTextToSize(summaryText, 180);

      if (currentY + summaryLines.length * 6 > 270) {
        doc.addPage();
        currentY = 20;
      }

      doc.text(summaryLines, 15, currentY);
      currentY += summaryLines.length * 6 + 10;
    }

    // ===== ROCK SIZE =====
    if (rockSize) {
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("Predicted Size:", 15, currentY);
      doc.setTextColor("#003399");
      doc.text(safeString(rockSize), 50, currentY);
      currentY += 10;
    }

    // ===== USE CASE SECTION (FULLY FIXED) =====
    if (useCase) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("Use Case:", 15, currentY);
        currentY += 6;
      
        doc.setFontSize(10);
        doc.setTextColor("#003399");
      
        const useCaseText = safeString(useCase);
        const paragraphs = useCaseText.split('\n').filter(p => p.trim());
      
        for (const para of paragraphs) {
          const lines = doc.splitTextToSize(para, 180);  // Make sure this width is large enough for the content
          
          for (const line of lines) {
            // Check if the content is about to overflow, and add a new page if necessary
            if (currentY > 270) {
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, 15, currentY);
            currentY += 6;  // Adjust line height if needed
          }
          currentY += 10; // Add space between paragraphs
        }
        currentY += 10;
      }

    // ===== TASKS TABLE (WITH TYPE SAFETY) =====
    const tableData = tasks.map(task => [
      safeString(task?.title) || "-",
      safeString(task?.department) || "-",
      safeString(task?.hours) || "-",
      safeString(task?.resources) || "-",
      safeString(task?.comment) || "-"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Title", "Department", "Duration", "Resources", "Comments"]],
      body: tableData,
      styles: { 
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: { 
        fillColor: [0, 51, 153],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { 
        fillColor: [245, 247, 255] 
      },
      margin: { left: 15, right: 15 }
    });

    // ===== FOOTER SECTION =====
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Totals
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Duration (Months): ${safeString(totalHours)}`, 150, finalY);
    doc.text(`Total Resources: ${safeString(totalResources)}`, 150, finalY + 8);

    // Metadata
    doc.setFontSize(10);
    doc.text(`Capability: ${safeString(capability) || "-"}`, 15, finalY + 20);
    doc.text(`Methodology: ${safeString(methodology) || "-"}`, 15, finalY + 26);
    doc.text(`Pillar: ${safeString(pillar) || "-"}`, 15, finalY + 32);
    doc.text(`Email: ${safeString(email).trim() || "N/A"}`, 15, finalY + 38);

    // ===== SAVE PDF =====
    const filename = `${safeString(title)
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)}_report.pdf`;
    
    doc.save(filename);

  } catch (error) {
    console.error("PDF generation failed:", error);
    alert(`Error generating PDF: ${safeString(error.message || "Unknown error")}`);
  }
};