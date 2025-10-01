"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
const opciones_1 = __importDefault(require("./opciones"));
class preguntas extends sequelize_1.Model {
}
preguntas.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    id_cuestionario: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    id_seccion: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    texto_pregunta: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'preguntas',
    timestamps: false,
});
preguntas.hasMany(opciones_1.default, {
    foreignKey: "id_preguntas", as: "m_preguntas"
});
exports.default = preguntas;
