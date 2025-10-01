"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../database/connection"));
const s_usuario_1 = __importDefault(require("./s_usuario"));
class Dependencia extends sequelize_1.Model {
    static associate(models) {
        Dependencia.hasMany(s_usuario_1.default, {
            foreignKey: "id_Dependencia", as: "m_usuarios"
        });
    }
}
Dependencia.init({
    id_Dependencia: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_Dependencia'
    },
    C_presupDep: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'C_presupDep'
    },
    Nombre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'Nombre'
    },
    Creado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'Creado'
    },
    F_Creacion: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: 'F_Creacion'
    },
    U_Modificacion: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'U_Modificacion'
    },
    Estado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'Estado'
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    nombre_completo: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 't_dependencia',
    timestamps: false,
});
// Dependencia.hasMany(SUsuario,{
//   foreignKey: "id_Dependencia", as: "m_usuarios"
// })
exports.default = Dependencia;
