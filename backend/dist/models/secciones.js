"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
const preguntas_1 = __importDefault(require("./preguntas"));
const opciones_1 = __importDefault(require("./opciones"));
class seccion extends sequelize_1.Model {
}
seccion.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    id_cuestionario: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'seccions',
    timestamps: false,
});
seccion.hasMany(preguntas_1.default, {
    foreignKey: "id_seccion", as: "m_preguntas"
});
preguntas_1.default.hasMany(opciones_1.default, {
    foreignKey: "id_preguntas", as: "m_opciones"
});
exports.default = seccion;
