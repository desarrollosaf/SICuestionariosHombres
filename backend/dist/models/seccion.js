"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Seccion extends sequelize_1.Model {
}
Seccion.init({
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
    tableName: 'seccions', // hace referencia a la tabla en tu base de datos
    timestamps: false, // cambia a true si tienes createdAt/updatedAt
});
exports.default = Seccion;
