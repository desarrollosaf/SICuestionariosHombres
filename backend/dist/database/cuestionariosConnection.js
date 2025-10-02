"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeCuestionarios = new sequelize_1.Sequelize('adminplem_jornadaSalud', 'usr_jornadasalud', 'P1OrpsDU6JqMtRDfGmqI', {
    host: '192.168.36.53',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});
exports.default = sequelizeCuestionarios;
