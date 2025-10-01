import { Request, Response } from "express"
import Dependencia from "../models/saf/t_dependencia";


export const getdependencias = async(req: Request, res: Response) : Promise<any> =>{
  try {
    const dep = await Dependencia.findAll({
        attributes:['id_Dependencia','nombre_completo']
    })

    return res.json({
        data: dep
    });
  } catch (error) {
        console.error('Error al obtener dependencias:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
}