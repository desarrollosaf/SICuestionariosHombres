"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../database/connection"));
const t_dependencia_1 = __importDefault(require("../saf/t_dependencia"));
const t_direccion_1 = __importDefault(require("../saf/t_direccion"));
const t_departamento_1 = __importDefault(require("../saf/t_departamento"));
const sesion_cuestionario_1 = __importDefault(require("../sesion_cuestionario"));
class SUsuario extends sequelize_1.Model {
    static associate(models) {
        SUsuario.belongsTo(t_dependencia_1.default, {
            // sourceKey: 'id_Dependencia',         
            foreignKey: 'id_Dependencia',
            as: 'dependencia',
        });
        SUsuario.belongsTo(t_direccion_1.default, {
            // sourceKey: 'id_Direccion',         
            foreignKey: 'id_Direccion',
            as: 'direccion',
        });
        SUsuario.belongsTo(t_departamento_1.default, {
            // sourceKey: 'id_Departamento',         
            foreignKey: 'id_Departamento',
            as: 'departamento',
        });
        SUsuario.belongsTo(sesion_cuestionario_1.default, {
            targetKey: "id_usuario",
            foreignKey: 'N_Usuario',
            as: "m_cuestionario"
        });
    }
}
SUsuario.init({
    id_Usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_Usuario'
    },
    N_Usuario: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'N_Usuario'
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
    id_Departamento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'id_Departamento'
    },
    Nombre: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'Nombre'
    },
    A_Paterno: {
        type: sequelize_1.DataTypes.STRING(25),
        allowNull: true,
        field: 'A_Paterno'
    },
    A_Materno: {
        type: sequelize_1.DataTypes.STRING(25),
        allowNull: true,
        field: 'A_Materno'
    },
    C_Electronico: {
        type: sequelize_1.DataTypes.STRING(70),
        allowNull: true,
        field: 'C_Electronico'
    },
    Contrasena: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'Contrasena'
    },
    Estado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'Estado'
    },
    Puesto: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'Puesto'
    },
    f_ingreso: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: 'f_ingreso'
    },
    grado_estudios: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: true,
    },
    grado_abreviado: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    curp: {
        type: sequelize_1.DataTypes.STRING(18),
        allowNull: true,
    },
    telefono: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    personal_secretarial_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        field: 'created_at',
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        field: 'updated_at',
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        field: 'deleted_at',
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 's_usuario',
    timestamps: false,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            name: 'id_Usuario',
            using: 'BTREE',
            fields: [{ name: 'id_Usuario' }],
        },
    ],
});
exports.default = SUsuario;
