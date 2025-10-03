import PDFDocument from "pdfkit";
import path from "path";

export async function generarReporteCitasPDF(
  fechap: string,
  sede: string,
  horarios: any[],
  citas: any[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const marginBottom = 60;
    const col1X = 50;
    const col2X = 150;
    const tableWidth = 500;

    const bgPath = path.join(__dirname, "../assets/hojacartacampaniasalud2.jpg");

    const drawHeader = () => {
      // Fondo de página
      doc.image(bgPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });

      doc.y = 106; // Fijar posición inicial en cada página

      // Encabezado
      doc.font("Helvetica-Bold").fontSize(20).fillColor("#7d0037")
        .text("Reporte de Citas", { align: "center" });

      doc.font("Helvetica").fontSize(12).fillColor("black");
      doc.text(`Sede: ${sede}`, { align: "center" });
      doc.text(`Fecha: ${fechap}`, { align: "center" });
      doc.moveDown(1);

      // Encabezado tabla
      const tableTop = doc.y;
      doc.rect(col1X - 5, tableTop - 5, tableWidth, 20).fill("#7d0037");
      doc.fillColor("white").font("Helvetica-Bold").fontSize(11);
      doc.text("Horario", col1X, tableTop);
      doc.text("Citas", col2X, tableTop);
      doc.fillColor("black");
      doc.moveDown(1);
    };

    // Primera página
    drawHeader();

    // Dibujar filas
    for (const h of horarios) {
      const hora = `${h.horario_inicio} - ${h.horario_fin}`;
      const citasHorario = citas.filter((c) => c.horario_id === h.id);

      let citasTexto = "";
      if (citasHorario.length === 0) {
        citasTexto = "— Sin citas —";
      } else {
        for (const cita of citasHorario) {
          const nombre = cita.datos_user?.nombre_completo || "Nombre desconocido";
          const correo = cita.correo ?? "Sin correo";
          const telefono = cita.telefono ?? "Sin teléfono";
          citasTexto += `• ${nombre} | Correo: ${correo} | Tel: ${telefono}\n`;
        }
      }

      // Calcular altura de la fila ajustada
      const citasWidth = 380;
      const textHeight = doc.heightOfString(citasTexto, { width: citasWidth, align: "left" });

      // Reducir el padding a 2
      const padding = 2;
      const rowHeight = Math.max(2, textHeight + padding); 

      // Verifica si el contenido cabe en la página sin generar espacios extra
      if (doc.y + rowHeight + marginBottom > doc.page.height) {
        doc.addPage();
        drawHeader(); // Dibuja el encabezado si se agrega una nueva página
      }

      const rowY = doc.y;

      // Fondo de fila
      doc.rect(col1X - 5, rowY - 2, tableWidth, rowHeight)
        .fillOpacity(0.05)
        .fill("#bdc3c7")
        .fillOpacity(1);

      // Escribir horario
      doc.fillColor("#000000").font("Helvetica-Bold").fontSize(10);
      doc.text(hora, col1X, rowY + 3);

      // Escribir citas
      if (citasHorario.length === 0) {
        doc.fillColor("black").font("Helvetica-Oblique").text(citasTexto, col2X, rowY + 3, { width: citasWidth });
      } else {
        doc.fillColor("black").font("Helvetica").fontSize(9);
        doc.text(citasTexto.trim(), col2X, rowY + 3, { width: citasWidth });
      }

      // Avanzar a la siguiente fila
      doc.y = rowY + rowHeight + 3; // Asegúrate de no dejar espacio innecesario
    }

    // Pie de página
    doc.moveDown(2);
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#7f8c8d")
      .text(`Generado el ${new Date().toLocaleString()}`, { align: "right" });

    doc.end();
  });
}
