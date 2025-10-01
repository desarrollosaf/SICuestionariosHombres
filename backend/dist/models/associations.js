"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seccion_1 = __importDefault(require("./seccion"));
const preguntas_1 = __importDefault(require("./preguntas"));
const opciones_1 = __importDefault(require("./opciones"));
// Relaciones
seccion_1.default.hasMany(preguntas_1.default, {
    foreignKey: 'id_seccion',
    as: 'm_preguntas',
});
preguntas_1.default.belongsTo(seccion_1.default, {
    foreignKey: 'id_seccion',
});
preguntas_1.default.hasMany(opciones_1.default, {
    foreignKey: 'id_pregunta',
    as: 'm_opciones',
});
opciones_1.default.belongsTo(preguntas_1.default, {
    foreignKey: 'id_pregunta',
});
