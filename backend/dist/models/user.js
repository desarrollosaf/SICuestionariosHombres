"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
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
    email_verified_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    remember_token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
});
exports.default = User;
