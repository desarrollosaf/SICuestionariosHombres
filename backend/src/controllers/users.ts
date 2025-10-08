import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  User  from '../models/saf/users'
import  UserBase  from '../models/user'
import  UsersSafs  from '../models/saf/s_usuario'
import jwt, { JwtPayload } from 'jsonwebtoken';
import SUsuario from '../models/saf/s_usuario';
import dotenv from 'dotenv';
import { dp_fum_datos_generales } from '../models/fun/dp_fum_datos_generales'
import Cita from '../models/citas'

export const ReadUser = async (req: Request, res: Response): Promise<any> => {
    const listUser = await User.findAll();
    return res.json({
        msg: `List de categoría encontrada exitosamenteeeee`,
        data: listUser
    });
}



export const LoginUser = async (req: Request, res: Response, next: NextFunction):  Promise<any> => {
    const { rfc, password } = req.body;
    let passwordValid = false;
    let user: any = null;
    let bandera = true;


    

    if (rfc.startsWith('JS')) {
        console.log('admin admin');
        bandera = false;
        user = await UserBase.findOne({ 
            where: { name: rfc },
        })
        if (!user) {
            return res.status(400).json({
                msg: `Usuario no existe con el rfc ${rfc}`
            })
        }
        passwordValid = await bcrypt.compare(password, user.password);
       

    }else{
        



        const asesor = await SUsuario.findOne({
      where: { N_Usuario: rfc },
      attributes: [
        "Puesto",
      ],
      raw: true
    });

    if (!asesor ||(asesor.id_Dependencia === 1 && asesor.Puesto &&asesor.Puesto.toUpperCase().includes("ASESOR"))) {
        return res.status(400).json({
            msg: `Este rfc es de un asesor ${rfc}`
        });
    }


    const Validacion = await dp_fum_datos_generales.findOne({ 
      where: { f_rfc: rfc },
      attributes: ["f_curp"]
    });

    if (!Validacion?.f_curp) {
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
    if (
      hoy.getMonth() < fechaNac.getMonth() || 
      (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
    ) {
      edad--;
    }

    if (sexo !== "H" || edad < 40) {
      return res.status(400).json({ msg: "Usuario no válido" });
    }
        user = await User.findOne({ 
            where: { rfc: rfc },
            include: [
                {
                    model: UsersSafs,
                    as: 'datos_user',
                },
            ],
        })
        console.log(user.datos_user)
        if (!user) {
            return res.status(400).json({
                msg: `Usuario no existe con el rfc ${rfc}`
            })
        }

        const hash = user.password.replace(/^\$2y\$/, '$2b$');
        passwordValid = await bcrypt.compare(password, hash);

    }



    if (!passwordValid) {
        return res.status(402).json({
            msg: `Password Incorrecto => ${password}`
        })
    }
    const totalCitas = await Cita.count();
        const citaUser = await Cita.findOne({
        where: { rfc: rfc }
        });
        if (totalCitas >= 500) {
            if(!citaUser){
                return res.status(416).json({
                                msg: "Ya no hay lugares disponibles. Solo hay espacio para 400 citas."
                            });
            }
            
        }

    const accessToken = jwt.sign(
        { rfc: rfc },
        process.env.SECRET_KEY || 'TSE-Poder-legislativo',
        { expiresIn: '2h' }
    );


    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000, 
        path: '/',
    });
        
    return res.json({ user,bandera })
}

export const getCurrentUser = (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
        rfc: user.rfc,
    });
};

export const cerrarsesion = async (req: Request, res: Response):  Promise<any> => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return res.status(200).json({ message: 'Sesión cerrada' });
};








