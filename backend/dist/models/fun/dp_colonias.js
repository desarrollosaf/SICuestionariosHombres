"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_colonias = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun"));
const dp_municipios_1 = require("../fun/dp_municipios");
class dp_colonias extends sequelize_1.Model {
    static initModel(sequelize) {
        dp_colonias.init({
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                defaultValue: '',
            },
            ciudad: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true,
            },
            municipio: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            asentamiento: {
                type: sequelize_1.DataTypes.STRING(25),
                allowNull: true,
            },
            codigo_postal: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
        }, {
            sequelize: fun_1.default, // conexión específica
            tableName: 'dp_colonias',
            timestamps: false,
            indexes: [
                { name: 'PRIMARY', unique: true, fields: ['id'] },
                { name: 'index_municipio', fields: ['municipio'] },
                { name: 'index_nombre', fields: ['nombre'] },
                { name: 'index_asentamiento', fields: ['asentamiento'] },
                { name: 'index_codigo_postal', fields: ['codigo_postal'] },
                { name: 'index_ciudad', fields: ['ciudad'] },
            ],
        });
        dp_colonias.belongsTo(dp_municipios_1.dp_municipios, {
            foreignKey: 'municipio',
            as: 'municipio_dp_municipio',
        });
        return dp_colonias;
    }
}
exports.dp_colonias = dp_colonias;
