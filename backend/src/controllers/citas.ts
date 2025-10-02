import { Request, Response } from "express";
import Cita from "../models/citas";
import HorarioCita from "../models/horarios_citas"; // ✅ corregido
import Sede from "../models/sedes";
import { Op } from "sequelize";
import { Sequelize, Model, DataTypes } from 'sequelize';
import UsersSafs from '../models/saf/users';
import SUsuario from '../models/saf/s_usuario';
import Dependencia from '../models/saf/t_dependencia';
import Direccion from '../models/saf/t_direccion';
import Departamento from '../models/saf/t_departamento';
import { dp_fum_datos_generales } from '../models/fun/dp_fum_datos_generales';
import { dp_datospersonales } from '../models/fun/dp_datospersonales';
import sequelizefun from '../database/fun'; // La conexión

dp_datospersonales.initModel(sequelizefun);
dp_fum_datos_generales.initModel(sequelizefun);

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

    const folio: number = Math.floor(10000000 + Math.random() * 90000000);

    const cita = await Cita.create({
      horario_id: body.horario_id,
      sede_id: body.sede_id,
      rfc: body.rfc,
      fecha_cita: body.fecha_cita,
      correo: body.correo,
      telefono: body.telefono,
      folio: folio
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

export const getcitasagrupadas = async (req: Request, res: Response): Promise<any> => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["id", "sede"]
        },
        {
          model: HorarioCita,
          as: "HorarioCita",
          attributes: ["horario_inicio", "horario_fin"]
        }
      ],
      order: [["fecha_cita", "ASC"], ["sede_id", "ASC"], ["horario_id", "ASC"]]
    });

    const agrupadas: Record<string, any> = {};

    citas.forEach(cita => {
      const fecha = new Date(cita.fecha_cita).toISOString().split("T")[0];
      const sede = (cita as any).Sede?.sede || "Desconocida";
      const citaAny = cita as any;
      const horario = citaAny.HorarioCita
        ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
        : "Horario desconocido";

      if (!agrupadas[fecha]) agrupadas[fecha] = { total_citas: 0, sedes: {} };
      if (!agrupadas[fecha].sedes[sede]) agrupadas[fecha].sedes[sede] = {};

      if (!agrupadas[fecha].sedes[sede][horario]) {
        agrupadas[fecha].sedes[sede][horario] = {
          total_citas: 0,
          citas: []
        };
      }

      agrupadas[fecha].total_citas += 1; 
      agrupadas[fecha].sedes[sede][horario].total_citas += 1;
      agrupadas[fecha].sedes[sede][horario].citas.push(cita);
    });

    const resultado = Object.keys(agrupadas).map(fecha => ({
      fecha_cita: fecha,
      total_citas: agrupadas[fecha].total_citas,
      sedes: Object.keys(agrupadas[fecha].sedes).map(sede => ({
        sede,
        horarios: Object.keys(agrupadas[fecha].sedes[sede]).map(horario => ({
          horario,
          total_citas: agrupadas[fecha].sedes[sede][horario].total_citas,
          citas: agrupadas[fecha].sedes[sede][horario].citas
        }))
      }))
    }));

    return res.json({
      msg: "Datos agrupados por fecha, sede y horario",
      citas: resultado
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};


export const getCita = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params; // Este es el RFC

  try {
    // Traemos todas las citas asociadas al RFC
    const citasser = await Cita.findAll({
      where: { rfc: id },
      include: [
        {
          model: Sede,
          as: "Sede",
          attributes: ["id", "sede"]
        },
        {
          model: HorarioCita,
          as: "HorarioCita",
          attributes: ["horario_inicio", "horario_fin"]
        }
      ],
      order: [["fecha_cita", "ASC"], ["horario_id", "ASC"]]
    });

    // Convertimos el resultado para incluir el rango horario
    const citasConHorario = citasser.map(cita => {
      const citaAny = cita as any; // Tipo flexible para TS
      return {
        id: cita.id,
        rfc: cita.rfc,
        fecha_cita: cita.fecha_cita,
        correo: cita.correo,
        telefono: cita.telefono,
        folio: cita.folio,
        sede: citaAny.Sede?.sede || "Desconocida",
        sede_id: citaAny.Sede?.id || null,
        horario_id: cita.horario_id,
        horario: citaAny.HorarioCita
          ? `${citaAny.HorarioCita.horario_inicio} - ${citaAny.HorarioCita.horario_fin}`
          : "Horario desconocido"
      };
    });


    const usuario = await SUsuario.findAll({
      where: { N_Usuario: id },
      attributes: [
        "Nombre",
      ],
      raw: true
    });
    
    return res.json({
      msg: "Cita obtenida",
      citas: citasConHorario,
      datosUser: usuario
    });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};

export const getcitasFecha = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fecha, rfc } = req.params;
    const prefijo = rfc.substring(0, 3).toUpperCase();

    let sedeFilter: any = {};
    if (prefijo === "JSV") {
      sedeFilter = { sede_id: 2 };
    } else if (prefijo === "JSC") {
      sedeFilter = { sede_id: 1 };
    } 


    const horarios = await HorarioCita.findAll({
      order: [["id", "ASC"]],
      raw: true
    });


    const citas = await Cita.findAll({
      where: {
        fecha_cita: { [Op.eq]: fecha },
        ...sedeFilter
      },
      include: [
        { model: Sede, as: "Sede", attributes: ["sede"] }
      ],
      order: [["horario_id", "ASC"]]
    });


    const resultado: Record<string, any[]> = {};

    for (const h of horarios) {
      const hora = `${h.horario_inicio} - ${h.horario_fin}`;
      resultado[hora] = [];
    }

    for (const cita of citas) {
      const horario = horarios.find(h => h.id === cita.horario_id);
      if (horario) {
        const hora = `${horario.horario_inicio} - ${horario.horario_fin}`;
        resultado[hora].push(cita);
      }
    }

  
    for (const cita of citas) {
      if (cita.rfc) {
        const datos = await dp_fum_datos_generales.findOne({
          where: { f_rfc: cita.rfc },
          attributes: [
            [Sequelize.literal(`CONCAT(f_nombre, ' ', f_primer_apellido, ' ', f_segundo_apellido)`), 'nombre_completo']
          ],
          raw: true
        });
        if (datos) {
          cita.setDataValue("datos_user", datos);
        }

        const usuario = await SUsuario.findOne({
          where: { N_Usuario: cita.rfc },
          attributes: ["N_Usuario"],
          include: [
            { model: Dependencia, as: "dependencia", attributes: ["nombre_completo"] },
            { model: Direccion, as: "direccion", attributes: ["nombre_completo"] },
            { model: Departamento, as: "departamento", attributes: ["nombre_completo"] }
          ]
        });
        if (usuario) {
          cita.setDataValue("dependencia", usuario);
        }
      }
    }

    return res.json({
      msg: "Horarios con citas agrupadas",
      horarios: resultado
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error al obtener los registros" });
  }
};

