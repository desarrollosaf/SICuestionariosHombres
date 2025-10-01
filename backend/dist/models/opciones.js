"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
const respuesta_1 = __importDefault(require("./respuesta"));
class opciones extends sequelize_1.Model {
}
opciones.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    id_preguntas: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    texto_opcion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'opciones',
    timestamps: false,
});
opciones.hasMany(respuesta_1.default, {
    foreignKey: "id_opcion", as: "m_respuestas"
});
exports.default = opciones;
