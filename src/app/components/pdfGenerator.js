"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdf = async () => {
  try {
    // 1. Get your data
    const currentProject = JSON.parse(localStorage.getItem("currentProject") || "{}");
    
    if (!currentProject?.reports) {
      alert("No project data found!");
      return;
    }

    // 2. Create a hidden HTML element
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px";
    pdfContainer.style.width = "210mm";
    pdfContainer.style.padding = "20px";
    document.body.appendChild(pdfContainer);

    // 3. Build your HTML content
    const { title, reports } = currentProject;
    const { useCase, tasks, rockSize } = reports;

    pdfContainer.innerHTML = `
      <div style="font-family: Arial; max-width: 210mm;">
        <!-- Header -->
        <div style="background: black; color: white; padding: 20px; text-align: center;">
          <h1>PM NETWORK ALLIANCE</h1>
        </div>
        
        <!-- Project Info -->
        <h2 style="margin-top: 30px;">${title || "Untitled Project"}</h2>
        
        <!-- Use Case - WILL SHOW FULL TEXT -->
        ${useCase ? `
          <div style="margin-top: 20px;">
            <h3>Use Case:</h3>
            <div style="white-space: pre-wrap; color: #003399;">
              ${useCase.replace(/\n/g, '<br>')}
            </div>
          </div>
        ` : ''}
        
        <!-- Tasks Table -->
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <thead>
            <tr style="background: #003399; color: white;">
              <th style="padding: 8px; text-align: left;">Title</th>
              <th style="padding: 8px; text-align: left;">Department</th>
              <th style="padding: 8px; text-align: left;">Duration</th>
              <th style="padding: 8px; text-align: left;">Resources</th>
              <th style="padding: 8px; text-align: left;">Comments</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(task => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${task.title || '-'}</td>
                <td style="padding: 8px;">${task.department || '-'}</td>
                <td style="padding: 8px;">${task.hours || '-'}</td>
                <td style="padding: 8px;">${task.resources || '-'}</td>
                <td style="padding: 8px;">${task.comment || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // 4. Convert to PDF
    const canvas = await html2canvas(pdfContainer);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
    
    // 5. Clean up and save
    document.body.removeChild(pdfContainer);
    pdf.save(`${title || 'project'}_report.pdf`);

  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("PDF generation failed. Please try again.");
  }
};