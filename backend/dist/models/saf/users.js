"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../database/connection"));
const s_usuario_1 = __importDefault(require("./s_usuario"));
class UsersSafs extends sequelize_1.Model {
}
UsersSafs.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    rfc: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },
    email_verified_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    remember_token: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    cambio_contrasena: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    whats: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    cel: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    path_foto: {
        type: sequelize_1.DataTypes.STRING(250),
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
    tableName: 'users_safs',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
        {
            name: 'users_safs_rfc_unique',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'rfc' }],
        },
    ],
});
UsersSafs.hasOne(s_usuario_1.default, {
    sourceKey: 'rfc', // Campo en UsersSafs
    foreignKey: 'N_Usuario', // Campo en SUsuario
    as: 'datos_user',
});
exports.default = UsersSafs;
