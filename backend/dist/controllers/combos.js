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
exports.getdependencias = void 0;
const t_dependencia_1 = __importDefault(require("../models/saf/t_dependencia"));
const getdependencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dep = yield t_dependencia_1.default.findAll({
            attributes: ['id_Dependencia', 'nombre_completo']
        });
        return res.json({
            data: dep
        });
    }
    catch (error) {
        console.error('Error al obtener dependencias:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
});
exports.getdependencias = getdependencias;
