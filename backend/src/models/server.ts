import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import UsersSafs from '../models/saf/users';
import rpreguntas from "../routes/preguntas";
import routeUser from "../routes/user";
import rcombos from  "../routes/combos";
import cookieParser from 'cookie-parser';
import path from 'path';
import { verifyToken } from '../middlewares/auth';
import routeCitas from "../routes/citas";
class Server {

    private app: Application
    private port: string
    

    constructor(){
        this.app = express()
        this.port = process.env.PORT || '3008'
        this.midlewares();
        this.router();
        this.DBconnetc();
        this.listen();
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => "+ this.port)           
        })
    }

    router(){
        this.app.use(rpreguntas);
        this.app.use(rcombos);
        this.app.use(routeUser);
        this.app.use(routeCitas);

    }

    
    midlewares(){
        this.app.use(express.json())
        this.app.use(cors({
            //origin: 'http://localhost:4200',
            origin: 'https://jornadasalud.congresoedomex.gob.mx',
            credentials: true
        }));

        this.app.use(cookieParser());
        this.app.use('/storage', express.static(path.join(process.cwd(), 'storage')));

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const publicPaths = [
                '/api/user/login',
                '/api/citas/getcitasfecha/',
                '/api/citas/exelgeneral/'
            ];
            const isPublic = publicPaths.some(path => req.originalUrl.startsWith(path));
            if (isPublic) {
                return next(); 
            }
            return verifyToken(req, res, next); 
        });

    }

    async DBconnetc(){
        try {
            await UsersSafs.sync();
            console.log("Conexion de DB exitoso");

        } catch (error) {
            console.log("Conexion de DB errorena => "+error);
            
        }
    }

    
}


export default Server