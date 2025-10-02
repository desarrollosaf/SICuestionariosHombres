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
exports.savecuestionario = exports.getHorariosDisponibles = void 0;
const citas_1 = __importDefault(require("../models/citas"));
const horarios_citas_1 = __importDefault(require("../models/horarios_citas")); // ✅ corregido
const sedes_1 = __importDefault(require("../models/sedes"));
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
const savecuestionario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const cita = yield citas_1.default.create({
            "horario_id": body.horario_id,
            "sede_id": body.sede_id,
            "rfc": body.rfc,
            "fecha_cita": body.fecha_cita,
        });
        return res.json({
            status: 200
        });
    }
    catch (error) {
        console.error('Error al guardar la cita:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
});
exports.savecuestionario = savecuestionario;
