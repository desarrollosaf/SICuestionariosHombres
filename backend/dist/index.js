"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s_usuario_1 = __importDefault(require("./models/saf/s_usuario"));
const t_departamento_1 = __importDefault(require("./models/saf/t_departamento"));
const t_dependencia_1 = __importDefault(require("./models/saf/t_dependencia"));
const t_direccion_1 = __importDefault(require("./models/saf/t_direccion"));
const server_1 = __importDefault(require("./models/server"));
const sesion_cuestionario_1 = __importDefault(require("./models/sesion_cuestionario"));
const server = new server_1.default();
const models = {
    SUsuario: s_usuario_1.default,
    Dependencia: t_dependencia_1.default,
    Direccion: t_direccion_1.default,
    Departamento: t_departamento_1.default,
    sesion: sesion_cuestionario_1.default
};
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});
exports.default = models;
