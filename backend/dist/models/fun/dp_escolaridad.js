"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_escolaridad = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun")); // Conexión específica a 'administracion'
class dp_escolaridad extends sequelize_1.Model {
    static initModel(sequelize) {
        return dp_escolaridad.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            escolaridad: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize: fun_1.default, // conexión específica
            tableName: 'dp_escolaridad',
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }],
                },
            ],
        });
    }
}
exports.dp_escolaridad = dp_escolaridad;
