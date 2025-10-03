"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarReporteCitasPDF = generarReporteCitasPDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
function generarReporteCitasPDF(fechap, sede, horarios, citas) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var _a, _b, _c;
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            const marginBottom = 60;
            const col1X = 50;
            const col2X = 150;
            const tableWidth = 500;
            const bgPath = path_1.default.join(__dirname, "../assets/hojacartacampaniasalud2.jpg");
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
                }
                else {
                    for (const cita of citasHorario) {
                        const nombre = ((_a = cita.datos_user) === null || _a === void 0 ? void 0 : _a.nombre_completo) || "Nombre desconocido";
                        const correo = (_b = cita.correo) !== null && _b !== void 0 ? _b : "Sin correo";
                        const telefono = (_c = cita.telefono) !== null && _c !== void 0 ? _c : "Sin teléfono";
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
                }
                else {
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
    });
}
