"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../database/connection"));
class Departamento extends sequelize_1.Model {
}
Departamento.init({
    id_Departamento: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_Departamento'
    },
    C_presupDepto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'C_presupDepto'
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
        allowNull: false,
        field: 'U_Modificacion'
    },
    Estado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'Estado'
    },
    id_Dependencia: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'id_Dependencia'
    },
    id_Direccion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'id_Direccion'
    },
    c_presup: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    nombre_completo: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    // nom_cap: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
}, {
    sequelize: connection_1.default,
    tableName: 't_departamento',
    timestamps: false,
    indexes: [
        {
            name: 'id_Departamento',
            using: 'BTREE',
            fields: [{ name: 'id_Departamento' }],
        },
    ],
});
exports.default = Departamento;
