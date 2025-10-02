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
exports.getcitasFecha = exports.getCita = exports.getcitasagrupadas = exports.savecita = exports.getHorariosDisponibles = void 0;
const citas_1 = __importDefault(require("../models/citas"));
const horarios_citas_1 = __importDefault(require("../models/horarios_citas")); // ✅ corregido
const sedes_1 = __importDefault(require("../models/sedes"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const s_usuario_1 = __importDefault(require("../models/saf/s_usuario"));
const t_dependencia_1 = __importDefault(require("../models/saf/t_dependencia"));
const t_direccion_1 = __importDefault(require("../models/saf/t_direccion"));
const t_departamento_1 = __importDefault(require("../models/saf/t_departamento"));
const dp_fum_datos_generales_1 = require("../models/fun/dp_fum_datos_generales");
const dp_datospersonales_1 = require("../models/fun/dp_datospersonales");
const fun_1 = __importDefault(require("../database/fun"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dp_datospersonales_1.dp_datospersonales.initModel(fun_1.default);
dp_fum_datos_generales_1.dp_fum_datos_generales.initModel(fun_1.default);
const getHorariosDisponibles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha } = req.params;
        const limite = 3;
        const citas = yield citas_1.default.findAll({
            where: { fecha_cita: fecha },
        });
        const horariosDisponibles = yield horarios_citas_1.default.findAll({
            order: [["id", "ASC"]],
        });
        const sedes = yield sedes_1.default.findAll();
        const resultado = [];
        horariosDisponibles.forEach(h => {
            const sedesDisponibles = [];
            sedes.forEach(s => {
                const cantidadCitas = citas.filter(c => c.horario_id === h.id && c.sede_id === s.id).length;
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener horarios disponibles" });
    }
});
exports.getHorariosDisponibles = getHorariosDisponibles;
const savecita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { body } = req;
        const limite = 3;
        // const citaExistente = await Cita.findOne({
        //   where: { rfc: body.rfc }
        // });
        // if (citaExistente) {
        //   return res.status(400).json({
        //     status: 400,
        //     msg: "Ya existe una cita registrada con ese RFC"
        //   });
        // }
        const cantidadCitas = yield citas_1.default.count({
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
        const cita = yield citas_1.default.create({
            horario_id: body.horario_id,
            sede_id: body.sede_id,
            rfc: body.rfc,
            fecha_cita: body.fecha_cita,
            correo: body.correo,
            telefono: body.telefono,
        });
        const horarios = yield horarios_citas_1.default.findOne({
            where: { id: body.horario_id }
        });
        const horario = horarios ? `${horarios.horario_inicio} - ${horarios.horario_fin}` : '';
        const sede2 = ((_a = (yield sedes_1.default.findOne({ where: { id: body.sede_id } }))) === null || _a === void 0 ? void 0 : _a.sede) || "";
        const Validacion = yield dp_fum_datos_generales_1.dp_fum_datos_generales.findOne({
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
        const pdfBuffer = yield generarPDFBuffer({
            folio: cita.id.toString(),
            nombreCompleto: nombreCompleto,
            sexo: sexo,
            edad: edad,
            correo: body.correo,
            curp: body.rfc,
            fecha: new Date().toLocaleDateString(),
            telefono: body.telefono,
            sede: sede2,
            horario: horario
        });
        // Enviar el PDF como respuesta al usuario
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="Cita-${body.fecha_cita}.pdf"`);
        res.send(pdfBuffer);
        return res.json({
            status: 200,
            msg: "Cita registrada correctamente",
        });
    }
    catch (error) {
        console.error('Error al guardar la cita:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
});
exports.savecita = savecita;
const getcitasagrupadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const citas = yield citas_1.default.findAll({
            include: [
                {
                    model: sedes_1.default,
                    as: "Sede",
                    attributes: ["id", "sede"]
                },
                {
                    model: horarios_citas_1.default,
                    as: "HorarioCita",
                    attributes: ["horario_inicio", "horario_fin"]
                }
            ],
            order: [["fecha_cita", "ASC"], ["sede_id", "ASC"], ["horario_id", "ASC"]]
        });
        const agrupadas = {};
        citas.forEach(cita => {
            var _a;
            const fecha = new Date(cita.fecha_cita).toISOString().split("T")[0];
            const sede = ((_a = cita.Sede) === null || _a === void 0 ? void 0 : _a.sede) || "Desconocida";
            const citaAny = cita;
            const horario = citaAny.HorarioCita
                ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
                : "Horario desconocido";
            if (!agrupadas[fecha])
                agrupadas[fecha] = { total_citas: 0, sedes: {} };
            if (!agrupadas[fecha].sedes[sede])
                agrupadas[fecha].sedes[sede] = {};
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
    }
});
exports.getcitasagrupadas = getcitasagrupadas;
const getCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Este es el RFC
    try {
        // Traemos todas las citas asociadas al RFC
        const citasser = yield citas_1.default.findAll({
            where: { rfc: id },
            include: [
                {
                    model: sedes_1.default,
                    as: "Sede",
                    attributes: ["id", "sede"]
                },
                {
                    model: horarios_citas_1.default,
                    as: "HorarioCita",
                    attributes: ["horario_inicio", "horario_fin"]
                }
            ],
            order: [["fecha_cita", "ASC"], ["horario_id", "ASC"]]
        });
        // Convertimos el resultado para incluir el rango horario
        const citasConHorario = citasser.map(cita => {
            var _a, _b;
            const citaAny = cita; // Tipo flexible para TS
            return {
                id: cita.id,
                rfc: cita.rfc,
                fecha_cita: cita.fecha_cita,
                correo: cita.correo,
                telefono: cita.telefono,
                sede: ((_a = citaAny.Sede) === null || _a === void 0 ? void 0 : _a.sede) || "Desconocida",
                sede_id: ((_b = citaAny.Sede) === null || _b === void 0 ? void 0 : _b.id) || null,
                horario_id: cita.horario_id,
                horario: citaAny.HorarioCita
                    ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
                    : "Horario desconocido"
            };
        });
        const usuario = yield s_usuario_1.default.findAll({
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
    }
    catch (error) {
        console.error("Error al obtener citas:", error);
        return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
    }
});
exports.getCita = getCita;
const getcitasFecha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, rfc } = req.params;
        const prefijo = rfc.substring(0, 3).toUpperCase();
        let sedeFilter = {};
        if (prefijo === "JSV") {
            sedeFilter = { sede_id: 2 };
        }
        else if (prefijo === "JSC") {
            sedeFilter = { sede_id: 1 };
        }
        const horarios = yield horarios_citas_1.default.findAll({
            order: [["id", "ASC"]],
            raw: true
        });
        const citas = yield citas_1.default.findAll({
            where: Object.assign({ fecha_cita: { [sequelize_1.Op.eq]: fecha } }, sedeFilter),
            include: [
                { model: sedes_1.default, as: "Sede", attributes: ["sede"] }
            ],
            order: [["horario_id", "ASC"]]
        });
        const resultado = {};
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
                const datos = yield dp_fum_datos_generales_1.dp_fum_datos_generales.findOne({
                    where: { f_rfc: cita.rfc },
                    attributes: [
                        [sequelize_2.Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), 'nombre_completo']
                    ],
                    raw: true
                });
                if (datos) {
                    cita.setDataValue("datos_user", datos);
                }
                const usuario = yield s_usuario_1.default.findOne({
                    where: { N_Usuario: cita.rfc },
                    attributes: ["N_Usuario"],
                    include: [
                        { model: t_dependencia_1.default, as: "dependencia", attributes: ["nombre_completo"] },
                        { model: t_direccion_1.default, as: "direccion", attributes: ["nombre_completo"] },
                        { model: t_departamento_1.default, as: "departamento", attributes: ["nombre_completo"] }
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
    }
});
exports.getcitasFecha = getcitasFecha;
function generarPDFBuffer(data) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const doc = new pdfkit_1.default({ size: 'LETTER', margin: 50 });
        const chunks = [];
        // Ruta donde se guardará el PDF
        const pdfDir = path_1.default.join(process.cwd(), 'public/pdfs');
        if (!fs_1.default.existsSync(pdfDir)) {
            fs_1.default.mkdirSync(pdfDir, { recursive: true });
        }
        const fileName = `acuse_${data.folio}.pdf`;
        const filePath = path_1.default.join(pdfDir, fileName);
        const writeStream = fs_1.default.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        // ✅ Imagen de fondo
        doc.image(path_1.default.join(__dirname, '../assets/acusederegistro.png'), 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
        });
        // Título centralizado
        doc.moveDown(4);
        doc.fontSize(18).font('Helvetica-Bold').text('CAMPANA GRATUITA DE SALUD MASCULINA', {
            align: 'center',
            underline: true
        });
        // Datos del paciente
        doc.moveDown(2);
        doc.fontSize(12)
            .font('Helvetica')
            .text(`Paciente: ${data.nombreCompleto} | ${data.sexo} | ${data.edad}`, { align: 'left' })
            .text(`CURP: ${data.curp}`, { align: 'left' })
            .text(`Correo electrónico: ${data.correo} | Teléfono: ${data.telefono} `, { align: 'left' })
            .text(`Ubicación: ${data.sede}`, { align: 'left' })
            .text(`Horario: ${data.horario}`, { align: 'left' });
        doc.moveDown();
        // Información adicional de la campaña
        doc.fontSize(11).text('El Voluntariado del Poder Legislativo del Estado de México organiza la Campaña gratuita de salud masculina, que incluye chequeo médico y la prueba de Antígeno Prostático Específico (PSA).', { align: 'justify' });
        // Detalles de la documentación
        doc.fontSize(11).text('Para acceder a este beneficio, es indispensable presentar en el día y hora asignados la siguiente documentación:', { align: 'justify' });
        doc.moveDown();
        doc.fontSize(11).list([
            'Identificación oficial: Se aceptará únicamente credencial para votar (INE) vigente o gafete oficial expedido por la Dirección de Administración y Desarrollo de Personal. Deberá presentar en original y copia. Si no se presenta alguno de estos documentos el día de la cita, no podrá realizar su examen y se le dará por perdido.',
        ], { bulletIndent: 20 });
        doc.moveDown();
        // Pie de página con aviso de privacidad
        doc.font('Helvetica-Bold')
            .fontSize(10)
            .text('Aviso de Privacidad', { align: 'left' });
        doc.font('Helvetica') // volver a fuente normal
            .fontSize(9)
            .text('Consúltalo en:', { align: 'left' });
        doc.font('Helvetica')
            .fontSize(9)
            .text('https://legislacion.legislativoedomex.gob.mx/storage/documentos/avisosprivacidad/expediente-clinico.pdf', { align: 'left' });
        doc.end();
    }));
}
