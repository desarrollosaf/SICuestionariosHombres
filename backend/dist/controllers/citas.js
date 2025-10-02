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
const fun_1 = __importDefault(require("../database/fun")); // La conexión
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
        });
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
        // Traemos todas las citas junto con sede y horario
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
                agrupadas[fecha] = {};
            if (!agrupadas[fecha][sede])
                agrupadas[fecha][sede] = {};
            if (!agrupadas[fecha][sede][horario]) {
                agrupadas[fecha][sede][horario] = {
                    total_citas: 0,
                    citas: []
                };
            }
            agrupadas[fecha][sede][horario].total_citas += 1;
            agrupadas[fecha][sede][horario].citas.push(cita);
        });
        const resultado = Object.keys(agrupadas).map(fecha => ({
            fecha_cita: fecha,
            sedes: Object.keys(agrupadas[fecha]).map(sede => ({
                sede,
                horarios: Object.keys(agrupadas[fecha][sede]).map(horario => ({
                    horario,
                    total_citas: agrupadas[fecha][sede][horario].total_citas,
                    citas: agrupadas[fecha][sede][horario].citas
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
        else {
            sedeFilter = {};
        }
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        console.log(fecha);
        const formatDate = (date) => date.toISOString().split('T')[0];
        const citas = yield citas_1.default.findAll({
            where: Object.assign({ fecha_cita: {
                    [sequelize_1.Op.eq]: fecha
                } }, sedeFilter),
            order: [["fecha_cita", "ASC"]]
        });
        console.log(citas);
        console.log(citas);
        for (const cita of citas) {
            if (cita.rfc) {
                console.log('Buscando datos personales para:', cita.rfc);
                const datos = yield dp_datospersonales_1.dp_datospersonales.findOne({
                    where: { f_rfc: cita.rfc },
                    attributes: [
                        'correo_ins',
                        'correo_per',
                        'numero_tel',
                        'numero_cel',
                        [sequelize_2.Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), 'nombre_completo']
                    ],
                    raw: true
                });
                if (datos) {
                    cita.setDataValue('datos_user', datos);
                }
            }
        }
        for (const cita of citas) {
            if (cita.rfc) {
                console.log('Buscando datos personales para:', cita.rfc);
                const datos = yield s_usuario_1.default.findOne({
                    where: { N_Usuario: cita.rfc },
                    attributes: [
                        'N_Usuario',
                    ],
                    include: [
                        {
                            model: t_dependencia_1.default,
                            as: 'dependencia',
                            attributes: [
                                'nombre_completo',
                            ],
                        },
                        {
                            model: t_direccion_1.default,
                            as: 'direccion',
                            attributes: [
                                'nombre_completo',
                            ],
                        },
                        {
                            model: t_departamento_1.default,
                            as: 'departamento',
                            attributes: [
                                'nombre_completo',
                            ],
                        },
                    ],
                });
                if (datos) {
                    cita.setDataValue('dependencia', datos);
                }
            }
        }
        return res.json({
            msg: `si existe el servidor`,
            citas: citas,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    }
});
exports.getcitasFecha = getcitasFecha;
