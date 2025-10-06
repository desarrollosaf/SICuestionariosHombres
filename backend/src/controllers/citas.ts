import { Request, Response } from "express";
import Cita from "../models/citas";
import HorarioCita from "../models/horarios_citas"; // ✅ corregido
import Sede from "../models/sedes";
import { Op } from "sequelize";
import { Sequelize, Model, DataTypes } from 'sequelize';
import UsersSafs from '../models/saf/users';
import SUsuario from '../models/saf/s_usuario';
import Dependencia from '../models/saf/t_dependencia';
import Direccion from '../models/saf/t_direccion';
import Departamento from '../models/saf/t_departamento';
import { dp_fum_datos_generales } from '../models/fun/dp_fum_datos_generales';
import { dp_datospersonales } from '../models/fun/dp_datospersonales';
import sequelizefun from '../database/fun'; 
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { generarReporteCitasPDF } from "./pdf.utils";
import ExcelJS from "exceljs";


dp_datospersonales.initModel(sequelizefun);
dp_fum_datos_generales.initModel(sequelizefun);

export const getHorariosDisponibles = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fecha } = req.params;
    const limite = 3; 
    
    const citas = await Cita.findAll({
      where: { fecha_cita: fecha },
    });

    const horariosDisponibles = await HorarioCita.findAll({
      order: [["id", "ASC"]],
    });

    const sedes = await Sede.findAll();

    const resultado: any[] = [];

    horariosDisponibles.forEach(h => {
      const sedesDisponibles: { sede_id: number; sede_texto: string }[] = [];

      sedes.forEach(s => {
        const cantidadCitas = citas.filter(
          c => c.horario_id === h.id && c.sede_id === s.id
        ).length;

        if (cantidadCitas < limite) {
          sedesDisponibles.push({ sede_id: s.id, sede_texto: s.sede });
        }
      });

      if (sedesDisponibles.length > 0) {
        resultado.push({
          horario_id: h.id,
          horario_texto: `${h.horario_inicio} - ${h.horario_fin}`,
          sedes: sedesDisponibles
        });
      }
    });

    return res.json({ horarios: resultado });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener horarios disponibles" });
  }
};



export const savecita = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const limite = 3;

    
    const citaExistente = await Cita.findOne({
      where: { rfc: body.rfc }
    });

    if (citaExistente) {
      return res.status(400).json({
        status: 400,
        msg: "Ya existe una cita registrada con ese RFC"
      });
    }

    const cantidadCitas = await Cita.count({
  where: {
    horario_id: body.horario_id,
    sede_id: body.sede_id,
    fecha_cita: body.fecha_cita
  }
});

if (cantidadCitas >= limite) {
  return res.status(400).json({
    status: 400,
    msg: "Este horario ya está ocupado para la fecha y sede seleccionada"
  });
}


    const folio: number = Math.floor(10000000 + Math.random() * 90000000);

    const cita = await Cita.create({
      horario_id: body.horario_id,
      sede_id: body.sede_id,
      rfc: body.rfc,
      fecha_cita: body.fecha_cita,
      correo: body.correo,
      telefono: body.telefono,
      folio: folio,
      path: '1'
    });



  
    const horarios = await HorarioCita.findOne({
      where: { id: body.horario_id }
    });
  const horario = horarios ? `${horarios.horario_inicio} - ${horarios.horario_fin}` : '';
  const sede2 = (await Sede.findOne({ where: { id: body.sede_id } }))?.sede || "";

   const Validacion = await dp_fum_datos_generales.findOne({ 
  where: { f_rfc: body.rfc },
  attributes: ["f_nombre", "f_primer_apellido", "f_segundo_apellido", "f_sexo", "f_fecha_nacimiento"]
});

if (!Validacion) {
  throw new Error("No se encontró información para el RFC proporcionado");
}

const nombreCompleto = [
  Validacion.f_nombre,
  Validacion.f_primer_apellido,
  Validacion.f_segundo_apellido
].filter(Boolean).join(" ");

const sexo = Validacion.f_sexo || "";

let edad = "";
if (Validacion.f_fecha_nacimiento) {
  const nacimiento = new Date(Validacion.f_fecha_nacimiento);
  const hoy = new Date();
  edad = (hoy.getFullYear() - nacimiento.getFullYear()).toString();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad = (parseInt(edad) - 1).toString();
  }
}

  const pdfBuffer = await generarPDFBuffer({
    folio: cita.folio,
    nombreCompleto: nombreCompleto,
    sexo: sexo,
    edad: edad,
    correo: body.correo,
    curp: body.rfc,
    fecha: cita.fecha_cita,
    telefono: body.telefono,
    sede: sede2,
    horario: horario,
    citaId: cita.id 
  });

  // Enviar el PDF como respuesta al usuario
  /*res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="Cita-${body.fecha_cita}.pdf"`);
  res.send(pdfBuffer);*/

  return res.json({
    status: 200,
    msg: "Cita registrada correctamente",
  });

    } catch (error) {
      console.error('Error al guardar la cita:', error);
      return res.status(500).json({ msg: 'Error interno del servidor' });
    }
  };

export const getcitasagrupadas = async (req: Request, res: Response): Promise<any> => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["id", "sede"]
        },
        {
          model: HorarioCita,
          as: "HorarioCita",
          attributes: ["horario_inicio", "horario_fin"]
        }
      ],
      order: [["fecha_cita", "ASC"], ["sede_id", "ASC"], ["horario_id", "ASC"]]
    });

    const agrupadas: Record<string, any> = {};

    citas.forEach(cita => {
      const fecha = new Date(cita.fecha_cita).toISOString().split("T")[0];
      const sede = (cita as any).Sede?.sede || "Desconocida";
      const citaAny = cita as any;
      const horario = citaAny.HorarioCita
        ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
        : "Horario desconocido";

      if (!agrupadas[fecha]) agrupadas[fecha] = { total_citas: 0, sedes: {} };
      if (!agrupadas[fecha].sedes[sede]) agrupadas[fecha].sedes[sede] = {};

      if (!agrupadas[fecha].sedes[sede][horario]) {
        agrupadas[fecha].sedes[sede][horario] = {
          total_citas: 0,
          citas: []
        };
      }

      agrupadas[fecha].total_citas += 1; 
      agrupadas[fecha].sedes[sede][horario].total_citas += 1;
      agrupadas[fecha].sedes[sede][horario].citas.push(cita);
    });

    const resultado = Object.keys(agrupadas).map(fecha => ({
      fecha_cita: fecha,
      total_citas: agrupadas[fecha].total_citas,
      sedes: Object.keys(agrupadas[fecha].sedes).map(sede => ({
        sede,
        horarios: Object.keys(agrupadas[fecha].sedes[sede]).map(horario => ({
          horario,
          total_citas: agrupadas[fecha].sedes[sede][horario].total_citas,
          citas: agrupadas[fecha].sedes[sede][horario].citas
        }))
      }))
    }));

    return res.json({
      msg: "Datos agrupados por fecha, sede y horario",
      citas: resultado
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};


export const getCita = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params; // Este es el RFC

  try {
    // Traemos todas las citas asociadas al RFC
    const citasser = await Cita.findAll({
      where: { rfc: id },
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["id", "sede"]
        },
        {
          model: HorarioCita,
          as: "HorarioCita",
          attributes: ["horario_inicio", "horario_fin"]
        }
      ],
      order: [["fecha_cita", "ASC"], ["horario_id", "ASC"]]
    });

    // Convertimos el resultado para incluir el rango horario
    const citasConHorario = citasser.map(cita => {
      const citaAny = cita as any; // Tipo flexible para TS
      return {
        id: cita.id,
        rfc: cita.rfc,
        fecha_cita: cita.fecha_cita,
        correo: cita.correo,
        telefono: cita.telefono,
        folio: cita.folio,
        path: cita.path,
        sede: citaAny.Sede?.sede || "Desconocida",
        sede_id: citaAny.Sede?.id || null,
        horario_id: cita.horario_id,
        horario: citaAny.HorarioCita
          ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
          : "Horario desconocido"
      };
    });


    const usuario = await SUsuario.findAll({
      where: { N_Usuario: id },
      attributes: [
        "Nombre",
      ],
      raw: true
    });
    
    return res.json({
      msg: "Cita obtenida",
      citas: citasConHorario,
      datosUser: usuario
    });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};

export const getcitasFecha = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fecha, rfc } = req.params;
    const prefijo = rfc.substring(0, 3).toUpperCase();

    let sedeFilter: any = {};
    if (prefijo === "JSV") {
      sedeFilter = { sede_id: 2 };
    } else if (prefijo === "JSC") {
      sedeFilter = { sede_id: 1 };
    } 


    const horarios = await HorarioCita.findAll({
      order: [["id", "ASC"]],
      raw: true
    });


    const citas = await Cita.findAll({
      where: {
        fecha_cita: { [Op.eq]: fecha },
        ...sedeFilter
      },
      include: [
        { model: Sede, as: "Sede", attributes: ["sede"] }
      ],
      order: [["horario_id", "ASC"]]
    });


    const resultado: Record<string, any[]> = {};

    for (const h of horarios) {
      const hora = `${h.horario_inicio} - ${h.horario_fin}`;
      resultado[hora] = [];
    }

    for (const cita of citas) {
      const horario = horarios.find(h => h.id === cita.horario_id);
      if (horario) {
        const hora = `${horario.horario_inicio} - ${horario.horario_fin}`;
        resultado[hora].push(cita);
      }
    }

  
    for (const cita of citas) {
      if (cita.rfc) {
        const datos = await dp_fum_datos_generales.findOne({
          where: { f_rfc: cita.rfc },
          attributes: [
            [Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), 'nombre_completo']
          ],
          raw: true
        });
        if (datos) {
          cita.setDataValue("datos_user", datos);
        }

        const usuario = await SUsuario.findOne({
          where: { N_Usuario: cita.rfc },
          attributes: ["N_Usuario"],
          include: [
            { model: Dependencia, as: "dependencia", attributes: ["nombre_completo"] },
            { model: Direccion, as: "direccion", attributes: ["nombre_completo"] },
            { model: Departamento, as: "departamento", attributes: ["nombre_completo"] }
          ]
        });
        if (usuario) {
          cita.setDataValue("dependencia", usuario);
        }
      }
    }

    return res.json({
      msg: "Horarios con citas agrupadas",
      horarios: resultado
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};

interface PDFData {
  folio: string;
  nombreCompleto: string;
  sexo: string;
  edad: string;
  correo: string;
  curp: string;
  fecha: string;
  telefono: string;
  sede: string;
  horario: string;
  citaId: number; // <-- ID de la cita para actualizar
}

export async function generarPDFBuffer(data: PDFData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 50 });
    const chunks: any[] = [];

    const pdfDir = path.join(process.cwd(), "storage/public/pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const fileName = `acuse_${data.folio}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    const relativePath = path.join("storage", "public", "pdfs", fileName);
    console.log(relativePath)
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.on("data", (chunk: any) => chunks.push(chunk));
    doc.on("end", async () => {
      try {
        // Guardar la ruta del PDF en la tabla citas
        await Cita.update(
          { path: relativePath },
          { where: { id: data.citaId } }
        );


        resolve(Buffer.concat(chunks));
      } catch (error) {
        reject(error);
      }
    });
    doc.on("error", reject);

    // ===== CONTENIDO DEL PDF =====
    doc.image(path.join(__dirname, "../assets/salud_page.jpg"), 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    doc.moveDown(5);
    doc
  .fontSize(18)
  .font("Helvetica-Bold")
  .fillColor("#7d0037") // ✅ Aplica el color
  .text("CAMPAÑA GRATUITA DE SALUD MASCULINA", {
    align: "center",
  })
  .fillColor("black");

    doc.moveDown(2);
    doc.font("Helvetica").fontSize(12).text(`Folio: ${data.folio}`, { align: "right" });
    doc.font("Helvetica").fontSize(12).text(`Fecha cita: ${data.fecha}`, { align: "right" });
    doc.fontSize(12)
      .font("Helvetica")
      .text(`Paciente: ${data.nombreCompleto} | Masculino | ${data.edad}`, { align: "left" })
      .text(`CURP: ${data.curp}`, { align: "left" })
      .text(`Correo electrónico: ${data.correo} | Teléfono: ${data.telefono}`, { align: "left" })
      .text(`Ubicación: ${data.sede}`, { align: "left" })
      .text(`Horario: ${data.horario}`, { align: "left" });

    doc.moveDown();
    doc.fontSize(11).text(
      "El Voluntariado del Poder Legislativo del Estado de México organiza la Campaña gratuita de salud masculina, que incluye Check up médico y la prueba de Antígeno Prostático Específico (PSA).",
      { align: "justify" }
    );

    doc.moveDown();
    doc.fontSize(11).text(
      "Para acceder a este beneficio, es indispensable presentar en el día y hora asignados la siguiente documentación:",
      { align: "justify" }
    );
    doc.moveDown();
    doc.fontSize(11).list(
      [
        "Identificación oficial: Se aceptará únicamente credencial para votar (INE) vigente o gafete oficial expedido por la Dirección de Administración y Desarrollo de Personal. Deberán presentarse en original y copia.",
      ],
      { bulletIndent: 20 }
    );
     doc.fontSize(11).text(
      "Si no se presenta alguno de estos documentos el día de la cita, no podrá realizar su examen y este se dará por perdido. Aviso de Privacidad",
      { align: "justify" }
    );

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(10).text("Aviso de Privacidad", { align: "left" });
    doc.font("Helvetica").fontSize(9).text("Consúltalo en:", { align: "left" });
    doc.font("Helvetica")
      .fontSize(9)
      .text(
        "https://legislacion.legislativoedomex.gob.mx/storage/documentos/avisosprivacidad/expediente-clinico.pdf",
        { align: "left" }
      );

    doc.end();
  });
}


export const generarPDFCitas = async (req: Request, res: Response) => {
  try {
    const { fecha, sedeId } = req.params;

    const horarios = await HorarioCita.findAll({
      order: [["id", "ASC"]],
      raw: true
    });

    const citas = await Cita.findAll({
      where: {
        fecha_cita: { [Op.eq]: fecha },
        sede_id: sedeId
      },
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["sede"]
        }
      ],
      order: [["horario_id", "ASC"]],
      raw: false
    }) as (Cita & { Sede?: { sede: string }, usuario?: any })[];

    // Obtener nombre de sede (o valor por defecto)
    const sedeNombre = citas[0]?.Sede?.sede || "SIN SEDE";

    // Obtener datos extra (nombre completo de usuario)
    for (const cita of citas) {
      if (cita.rfc) {
        const datos = await dp_fum_datos_generales.findOne({
          where: { f_rfc: cita.rfc },
          attributes: [
            [Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), 'nombre_completo']
          ],
          raw: true
        });
        if (datos) {
          (cita as any).datos_user = datos; // ✅ lo agregas directamente
        }
      }
    }
    console.log(citas)
    function formatearFecha(fechaStr: string) {
      const [año, mes, dia] = fechaStr.split("-").map(Number);
      const fechaObj = new Date(año, mes - 1, dia); // mes-1 porque en JS enero = 0
      const opciones: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      return fechaObj.toLocaleDateString("es-ES", opciones);
    }
    const fechap = formatearFecha(fecha);
    const pdfBuffer = await generarReporteCitasPDF(fechap, sedeNombre, horarios, citas);

    // Retornar el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Reporte-${fecha}-sede${sedeId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
};


export const generarExcelCitas = async (req: Request, res: Response) => {
  try {
    const { fecha, sedeId } = req.params;

    const horarios = await HorarioCita.findAll({
      order: [["id", "ASC"]],
      raw: true
    });

    const citas = await Cita.findAll({
      where: {
        fecha_cita: { [Op.eq]: fecha },
        sede_id: sedeId
      },
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["sede"]
        }
      ],
      order: [["horario_id", "ASC"]],
      raw: false
    }) as (Cita & { Sede?: { sede: string }, usuario?: any })[];

    const sedeNombre = citas[0]?.Sede?.sede || "SIN SEDE";

   
    for (const cita of citas) {
      if (cita.rfc) {
        const datos = await dp_fum_datos_generales.findOne({
          where: { f_rfc: cita.rfc },
          attributes: [
            [Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), "nombre_completo"]
          ],
          raw: true
        });
        if (datos) {
          (cita as any).datos_user = datos;
        }

         const usuario = await SUsuario.findOne({
          where: { N_Usuario: cita.rfc },
          attributes: ["N_Usuario"],
          include: [
            { model: Dependencia, as: "dependencia", attributes: ["nombre_completo"] },
            { model: Direccion, as: "direccion", attributes: ["nombre_completo"] },
            { model: Departamento, as: "departamento", attributes: ["nombre_completo"] }
          ],
          raw: true
        });
        if (usuario) {
          cita.setDataValue("dependencia", usuario);
        }
      }
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte de Citas");

    // Agregar título general arriba
    const titulo = `Citas de la sede ${sedeNombre} - ${fecha}`;
    sheet.addRow([titulo]);
    const titleRow = sheet.getRow(1);
    titleRow.font = { size: 14, bold: true };
    sheet.mergeCells(`A1:D1`); // Unir las columnas A-D para el título
    titleRow.alignment = { horizontal: "center" };

    // Dejar una fila vacía
    sheet.addRow([]);

    // Encabezados
    sheet.addRow(["Horario", "Nombre","Dependencia","Direccion","Departamento", "Correo", "Teléfono"]);
    const headerRow = sheet.getRow(3); // Fila 3 porque hay título y fila vacía
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // Datos
    for (const h of horarios) {
      const hora = `${h.horario_inicio} - ${h.horario_fin}`;
      const citasHorario = citas.filter(c => c.horario_id === h.id);

      if (citasHorario.length === 0) {
        sheet.addRow([hora, "— Sin citas —", "", ""]);
      } else {
        for (const cita of citasHorario) {
          const nombre =
            (cita as any).datos_user?.nombre_completo || "Nombre desconocido";
          const correo = cita.correo ?? "Sin correo";
          const telefono = cita.telefono ?? "Sin teléfono";

          sheet.addRow([hora, nombre, correo, telefono]);
        }
      }
    }

    // Ajustar ancho columnas automáticamente
    sheet.columns?.forEach(column => {
      if (column && typeof column.eachCell === "function") {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const value = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, value.length);
        });
        column.width = maxLength + 5;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Reporte-${fecha}-sede${sedeNombre}.xlsx"`
    );
    res.send(buffer);

  } catch (error) {
    console.error("❌ Error generando Excel:", error);
    res.status(500).json({ error: "Error generando Excel" });
  }
};


export const generalExcel = async (req: Request, res: Response) => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["sede"],
        },
      ],
      order: [["horario_id", "ASC"]],
      raw: false,
    }) as (Cita & { Sede?: { sede: string }; datos_user?: any; dependencia?: any })[];

    // 🔹 Enriquecer datos
    for (const cita of citas) {
      if (cita?.rfc) {
        const datos = await dp_fum_datos_generales.findOne({
          where: { f_rfc: cita.rfc },
          attributes: [
            "f_curp",
            [Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), "nombre_completo"],
          ],
          raw: true,
        });

        if (datos) {
          (cita as any).datos_user = datos;
        }

        const usuario = await SUsuario.findOne({
          where: { N_Usuario: cita.rfc },
          attributes: ["N_Usuario"],
          include: [
            { model: Dependencia, as: "dependencia", attributes: ["nombre_completo"] },
            { model: Direccion, as: "direccion", attributes: ["nombre_completo"] },
            { model: Departamento, as: "departamento", attributes: ["nombre_completo"] },
          ],
        });

        if (usuario) {
          (cita as any).dependencia = usuario;
        }
      }
    }
    console.log(citas)
    // 🔹 Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte de Citas");

    // 🔹 Título
    const titulo = `Reporte General`;
    sheet.addRow([titulo]);
    const titleRow = sheet.getRow(1);
    titleRow.font = { size: 14, bold: true };
    sheet.mergeCells(`A1:E1`);
    titleRow.alignment = { horizontal: "center" };

    sheet.addRow([]); // fila vacía

    // 🔹 Encabezados
    const headers = ["Curp", "Nombre", "Dependencia", "Dirección", "Departamento"];
    sheet.addRow(headers);
    const headerRow = sheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // 🔹 Agregar datos
    for (const cita of citas) {
      const datos_user = (cita as any).datos_user || {};
      const dep = (cita as any).dependencia || {};

      const curp = datos_user.f_curp || "";
      const nombre = datos_user.nombre_completo || "";
      const dependencia = dep?.dependencia?.nombre_completo || "";
      const direccion = dep?.direccion?.nombre_completo || "";
      const departamento = dep?.departamento?.nombre_completo || "";

      sheet.addRow([curp, nombre, dependencia, direccion, departamento]);
    }

    // 🔹 Ajustar ancho automático
    sheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
      }
    });

    // 🔹 Generar buffer y enviar
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="Reporte-general.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error("❌ Error generando Excel:", error);
    res.status(500).json({ error: "Error generando Excel" });
  }
};

