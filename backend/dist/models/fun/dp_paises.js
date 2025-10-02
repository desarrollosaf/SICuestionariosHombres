"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_paises = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun")); // Conexión específica a 'administracion'
class dp_paises extends sequelize_1.Model {
    static initModel(sequelize) {
        return dp_paises.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            nombre: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                defaultValue: '',
            },
        }, {
            sequelize: fun_1.default, // conexión específica
            tableName: 'dp_paises',
            timestamps: false,
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
exports.dp_paises = dp_paises;
