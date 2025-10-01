"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'TSE-Poder-legislativo';
// export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         res.status(401).json({ msg: 'Token no proporcionado' });
//         return;
//     }
//     try {
//         const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
//         (req as any).user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Token inválido' });
//         return;
//     }
// };
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(401).json({ msg: 'Token no proporcionado' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};
exports.verifyToken = verifyToken;
