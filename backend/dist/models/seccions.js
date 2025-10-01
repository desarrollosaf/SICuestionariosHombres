"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const preguntas_1 = __importDefault(require("./preguntas"));
const opciones_1 = __importDefault(require("./opciones"));
class seccions extends sequelize_1.Model {
}
seccions.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    id_cuestionario: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'seccions', // Nombre correcto de la tabla en MySQL
    timestamps: false, // Cambia a true si usas createdAt/updatedAt
});
// Relaciones
seccions.hasMany(preguntas_1.default, {
    foreignKey: 'id_seccion',
    as: 'm_preguntas'
});
preguntas_1.default.hasMany(opciones_1.default, {
    foreignKey: 'id_pregunta', // corregido: era 'id_preguntas'
    as: 'm_opciones',
});
exports.default = seccions;
