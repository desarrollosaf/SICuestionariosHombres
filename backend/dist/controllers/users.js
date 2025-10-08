"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cerrarsesion = exports.getCurrentUser = exports.LoginUser = exports.ReadUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/saf/users"));
const user_1 = __importDefault(require("../models/user"));
const s_usuario_1 = __importDefault(require("../models/saf/s_usuario"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const s_usuario_2 = __importDefault(require("../models/saf/s_usuario"));
const dp_fum_datos_generales_1 = require("../models/fun/dp_fum_datos_generales");
const citas_1 = __importDefault(require("../models/citas"));
const ReadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUser = yield users_1.default.findAll();
    return res.json({
        msg: `List de categoría encontrada exitosamenteeeee`,
        data: listUser
    });
});
exports.ReadUser = ReadUser;
const LoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rfc, password } = req.body;
    let passwordValid = false;
    let user = null;
    let bandera = true;
    if (rfc.startsWith('JS')) {
        console.log('admin admin');
        bandera = false;
        user = yield user_1.default.findOne({
            where: { name: rfc },
        });
        if (!user) {
            return res.status(400).json({
                msg: `Usuario no existe con el rfc ${rfc}`
            });
        }
        passwordValid = yield bcrypt_1.default.compare(password, user.password);
    }
    else {
        const asesor = yield s_usuario_2.default.findOne({
            where: { N_Usuario: rfc },
            attributes: [
                "Puesto",
            ],
            raw: true
        });
        if (!asesor || (asesor.id_Dependencia === 1 && asesor.Puesto && asesor.Puesto.toUpperCase().includes("ASESOR"))) {
            return res.status(400).json({
                msg: `Este rfc es de un asesor ${rfc}`
            });
        }
        const Validacion = yield dp_fum_datos_generales_1.dp_fum_datos_generales.findOne({
            where: { f_rfc: rfc },
            attributes: ["f_curp"]
        });
        if (!(Validacion === null || Validacion === void 0 ? void 0 : Validacion.f_curp)) {
            return res.status(404).json({ msg: "Usuario no encontrado o CURP inválida" });
        }
        const curp = Validacion.f_curp;
        const sexo = curp[10];
        const yy = parseInt(curp.slice(4, 6));
        const mm = parseInt(curp.slice(6, 8)) - 1;
        const dd = parseInt(curp.slice(8, 10));
        const currentYY = new Date().getFullYear() % 100;
        const yyyy = yy > currentYY ? 1900 + yy : 2000 + yy;
        const fechaNac = new Date(yyyy, mm, dd);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (hoy.getMonth() < fechaNac.getMonth() ||
            (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        if (sexo !== "H" || edad < 40) {
            return res.status(400).json({ msg: "Usuario no válido" });
        }
        user = yield users_1.default.findOne({
            where: { rfc: rfc },
            include: [
                {
                    model: s_usuario_1.default,
                    as: 'datos_user',
                },
            ],
        });
        console.log(user.datos_user);
        if (!user) {
            return res.status(400).json({
                msg: `Usuario no existe con el rfc ${rfc}`
            });
        }
        const hash = user.password.replace(/^\$2y\$/, '$2b$');
        passwordValid = yield bcrypt_1.default.compare(password, hash);
    }
    if (!passwordValid) {
        return res.status(402).json({
            msg: `Password Incorrecto => ${password}`
        });
    }
    const totalCitas = yield citas_1.default.count();
    const citaUser = yield citas_1.default.findOne({
        where: { rfc: rfc }
    });
    if (totalCitas >= 500) {
        if (!citaUser) {
            return res.status(416).json({
                msg: "Ya no hay lugares disponibles. Solo hay espacio para 400 citas."
            });
        }
    }
    const accessToken = jsonwebtoken_1.default.sign({ rfc: rfc }, process.env.SECRET_KEY || 'TSE-Poder-legislativo', { expiresIn: '2h' });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
        path: '/',
    });
    return res.json({ user, bandera });
});
exports.LoginUser = LoginUser;
const getCurrentUser = (req, res) => {
    const user = req.user;
    res.json({
        rfc: user.rfc,
    });
};
exports.getCurrentUser = getCurrentUser;
const cerrarsesion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
    return res.status(200).json({ message: 'Sesión cerrada' });
});
exports.cerrarsesion = cerrarsesion;
