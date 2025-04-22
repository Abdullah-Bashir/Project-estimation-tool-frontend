"use client";

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
        // Import modules
        const pdfMakeModule = await import('pdfmake/build/pdfmake.min.js');
        const pdfFontsModule = await import('pdfmake/build/vfs_fonts.js');

        // Correct module handling
        const pdfMake = pdfMakeModule.default || pdfMakeModule;
        const pdfFonts = pdfFontsModule.default || pdfFontsModule;

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const logoBase64 = await getBase64ImageFromUrl(`${window.location.origin}/logo.png`);

        const capability = localStorage.getItem("capability") || "N/A";
        const methodology = localStorage.getItem("methodology") || "N/A";
        const pillar = localStorage.getItem("pillar") || "N/A";
        const email = localStorage.getItem("email") || "N/A";
        const projectName = localStorage.getItem("projectName") || "Project Name";

        const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);
        const totalResources = tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0);

        const docDefinition = {
            pageSize: 'A4',
            content: [
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                stack: [
                                    { image: 'logo', width: 60, alignment: 'center', margin: [0, 10, 0, 5] },
                                    { text: 'PM NETWORK ALLIANCE', style: 'companyName' },
                                ],
                                fillColor: '#000000',
                            }]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [20, 0, 20, 20],
                },
                {
                    margin: [40, 0, 40, 0],
                    stack: [
                        { text: projectName, style: 'projectNameHeader' },
                        { text: `PREDICTED SIZE: ${rockSize}`, style: 'infoSlim' },
                        { text: `USE CASE CATEGORY: ${useCase}`, style: 'infoSlim', margin: [0, 0, 0, 10] },
                        { text: 'TASKS:', style: 'tasksHeader', margin: [0, 10] },
                        {
                            table: {
                                headerRows: 1,
                                widths: ['*', '*', 'auto', 'auto', '*'],
                                body: [
                                    [
                                        { text: 'Title', style: 'tableHeaderSlim' },
                                        { text: 'Department', style: 'tableHeaderSlim' },
                                        { text: 'Hours', style: 'tableHeaderSlim' },
                                        { text: 'Resources', style: 'tableHeaderSlim' },
                                        { text: 'Comments', style: 'tableHeaderSlim' },
                                    ],
                                    ...tasks.map((task) => [
                                        task.title || '-',
                                        task.department || '-',
                                        task.hours || '-',
                                        task.resources || '-',
                                        task.comment || '-',
                                    ]),
                                ],
                            },
                            layout: {
                                fillColor: (rowIndex) => rowIndex === 0 ? '#003399' : (rowIndex % 2 === 0 ? '#F2F6FF' : null),
                                hLineColor: () => '#ccc',
                                vLineColor: () => '#ccc',
                                hLineWidth: () => 0.4,
                                vLineWidth: () => 0.4,
                                paddingTop: () => 4,
                                paddingBottom: () => 4,
                                paddingLeft: () => 6,
                                paddingRight: () => 6,
                            },
                            margin: [0, 0, 0, 10],
                        },
                        {
                            columns: [
                                { text: '' },
                                {
                                    stack: [
                                        { text: `Total Hours: ${totalHours}`, style: 'totalSlim', margin: [0, 5] },
                                        { text: `Total Resources: ${totalResources}`, style: 'totalSlim' },
                                    ],
                                    alignment: 'right',
                                }
                            ]
                        },
                        { text: '', margin: [0, 20, 0, 0] },
                        { text: `Capability: ${capability}`, style: 'infoText' },
                        { text: `Methodology: ${methodology}`, style: 'infoText' },
                        { text: `Pillar: ${pillar}`, style: 'infoText' },
                        { text: `Email Address: ${email}`, style: 'infoText' },
                    ]
                }
            ],
            styles: {
                companyName: {
                    fontSize: 16,
                    bold: true,
                    color: '#fff',
                    alignment: 'center',
                    margin: [0, 0, 0, 5],
                },
                projectNameHeader: {
                    fontSize: 18,
                    bold: true,
                    color: '#000000',
                    marginBottom: 6,
                },
                tasksHeader: {
                    fontSize: 14,
                    bold: true,
                    marginBottom: 6,
                    color: '#444',
                },
                tableHeaderSlim: {
                    bold: true,
                    fontSize: 10,
                    color: '#fff',
                },
                totalSlim: {
                    fontSize: 11,
                    bold: true,
                    color: '#003399',
                },
                infoText: {
                    fontSize: 10,
                    margin: [0, 2],
                },
                infoSlim: {
                    fontSize: 10,
                    margin: [0, 0, 0, 2],
                    color: '#003399',
                },
            },
            images: {
                logo: logoBase64,
            }
        };

        pdfMake.createPdf(docDefinition).download('project-estimation-report.pdf');
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
    }
};
