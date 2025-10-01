"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
class sesion extends sequelize_1.Model {
}
sesion.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    fecha_registro: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    comentarios: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'sesion_cuestionarios',
    timestamps: false,
});
exports.default = sesion;
