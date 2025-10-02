"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_municipios = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun")); // Conexión específica a 'administracion'
const dp_estados_1 = require("../fun/dp_estados");
class dp_municipios extends sequelize_1.Model {
    static initModel(sequelize) {
        dp_municipios.init({
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                defaultValue: '',
            },
            estado: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize: fun_1.default, // conexión específica
            tableName: 'dp_municipios',
            timestamps: false,
            indexes: [
                { name: 'PRIMARY', unique: true, fields: ['id'] },
                { name: 'index_estado', fields: ['estado'] },
            ],
        });
        dp_municipios.belongsTo(dp_estados_1.dp_estados, {
            foreignKey: 'estado',
            as: 'estado_dp_estado',
        });
        return dp_municipios;
    }
}
exports.dp_municipios = dp_municipios;
