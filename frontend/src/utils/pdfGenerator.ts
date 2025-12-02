import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Colores corporativos
const COLORS = {
    primary: '#2e7d32', // Verde oscuro profesional
    secondary: '#4caf50', // Verde más claro
    text: '#333333',
    textLight: '#666666',
    white: '#ffffff',
    tableHeader: '#2e7d32',
    tableRowOdd: '#f5f5f5',
    border: '#e0e0e0'
};

interface PDFOptions {
    title: string;
    subtitle?: string;
    filename: string;
    columns: string[];
    data: any[][];
    orientation?: 'portrait' | 'landscape';
}

export const generateModernPDF = ({
    title,
    subtitle,
    filename,
    columns,
    data,
    orientation = 'portrait'
}: PDFOptions) => {
    const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // --- CABECERA ---

    // Logo / Nombre de la empresa
    doc.setFontSize(22);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Agro Precisión', margin, 20);

    // Subtítulo del reporte
    doc.setFontSize(14);
    doc.setTextColor(COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(title, margin, 28);

    if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(COLORS.textLight);
        doc.text(subtitle, margin, 34);
    }

    // Fecha a la derecha
    const dateStr = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.setTextColor(COLORS.textLight);
    doc.text(dateStr, pageWidth - margin, 20, { align: 'right' });

    // Línea separadora
    doc.setDrawColor(COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageWidth - margin, 38);

    // --- TABLA ---
    autoTable(doc, {
        head: [columns],
        body: data,
        startY: 45,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 3,
            textColor: COLORS.text,
            lineColor: COLORS.border,
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: COLORS.tableHeader,
            textColor: COLORS.white,
            fontStyle: 'bold',
            halign: 'center',
        },
        columnStyles: {
            // Ajuste automático
        },
        alternateRowStyles: {
            fillColor: COLORS.tableRowOdd,
        },
        margin: { top: 45, right: margin, bottom: 20, left: margin },
        didDrawPage: (data) => {
            // Pie de página en cada página
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(COLORS.textLight);
            const footerText = `Generado por Agro Precisión - Página ${pageCount}`;
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
    });

    doc.save(`${filename}.pdf`);
};

// Función para generar ficha técnica individual (ej: Actividad)
export const generateDetailPDF = (
    title: string,
    data: { label: string; value: string }[],
    filename: string
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = 20;

    // Cabecera
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Agro Precisión', margin, yPos);

    yPos += 10;
    doc.setFontSize(16);
    doc.setTextColor(COLORS.text);
    doc.text(title, margin, yPos);

    yPos += 5;
    doc.setDrawColor(COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 15;

    // Contenido tipo ficha
    data.forEach((item) => {
        // Etiqueta
        doc.setFontSize(11);
        doc.setTextColor(COLORS.textLight);
        doc.setFont('helvetica', 'bold');
        doc.text(item.label.toUpperCase(), margin, yPos);

        // Valor
        doc.setFontSize(12);
        doc.setTextColor(COLORS.text);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(item.value, pageWidth - margin - 60);
        doc.text(splitText, margin + 50, yPos);

        yPos += 8 + (splitText.length * 5);

        // Línea separadora suave
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
    });

    // Pie de página
    const dateStr = new Date().toLocaleDateString('es-AR');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text(`Generado el ${dateStr}`, margin, 280);
    doc.text('Agro Precisión', pageWidth - margin, 280, { align: 'right' });

    doc.save(`${filename}.pdf`);
};
