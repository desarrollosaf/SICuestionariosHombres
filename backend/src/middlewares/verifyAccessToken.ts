import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyAccessToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    console.log('Headers:', req.headers);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return; // terminamos aquí
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

export default verifyAccessToken;