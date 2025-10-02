import { Request, Response } from "express";
import Cita from "../models/citas";
import HorarioCita from "../models/horarios_citas"; // ✅ corregido
import Sede from "../models/sedes";
import { Op } from "sequelize";


export const getHorariosDisponibles = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fecha } = req.params;
    const limite = 3; 
    
    const citas = await Cita.findAll({
      where: { fecha_cita: fecha },
    });

    const horariosDisponibles = await HorarioCita.findAll({
      order: [["id", "ASC"]],
    });

    const sedes = await Sede.findAll();

    const resultado: any[] = [];

    horariosDisponibles.forEach(h => {
      const sedesDisponibles: { sede_id: number; sede_texto: string }[] = [];

      sedes.forEach(s => {
        const cantidadCitas = citas.filter(
          c => c.horario_id === h.id && c.sede_id === s.id
        ).length;

        if (cantidadCitas < limite) {
          sedesDisponibles.push({ sede_id: s.id, sede_texto: s.sede });
        }
      });

      if (sedesDisponibles.length > 0) {
        resultado.push({
          horario_id: h.id,
          horario_texto: `${h.horario_inicio} - ${h.horario_fin}`,
          sedes: sedesDisponibles
        });
      }
    });

    return res.json({ horarios: resultado });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener horarios disponibles" });
  }
};



export const savecita = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const limite = 3;

    
    // const citaExistente = await Cita.findOne({
    //   where: { rfc: body.rfc }
    // });

    // if (citaExistente) {
    //   return res.status(400).json({
    //     status: 400,
    //     msg: "Ya existe una cita registrada con ese RFC"
    //   });
    // }

    const cantidadCitas = await Cita.count({
      where: {
        horario_id: body.horario_id,
        sede_id: body.sede_id,
        fecha_cita: body.fecha_cita
      }
    });

    if (cantidadCitas >= limite) {
      return res.status(400).json({
        status: 400,
        msg: "Este horario ya está ocupado para la fecha y sede seleccionada"
      });
    }

    const cita = await Cita.create({
      horario_id: body.horario_id,
      sede_id: body.sede_id,
      rfc: body.rfc,
      fecha_cita: body.fecha_cita,
    });

    return res.json({
      status: 200,
      msg: "Cita registrada correctamente",
    });

  } catch (error) {
    console.error('Error al guardar la cita:', error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};
