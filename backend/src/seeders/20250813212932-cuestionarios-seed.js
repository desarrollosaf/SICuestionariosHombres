'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    
    const cuestionarioId = uuidv4();
    const seccion1 = uuidv4();
    const seccion2 = uuidv4();
    const seccion3 = uuidv4();
    const seccion4 = uuidv4();
    const seccion5 = uuidv4();
    const seccion6 = uuidv4();

    const idSexo = uuidv4();
    const idGenero = uuidv4();
    const idEdad = uuidv4();
    const idEstadoCivil = uuidv4();
    const idDependientes = uuidv4();
    const idDiscapacidad = uuidv4();
    const idAntigPL = uuidv4();
    const idAntiPuestoPL = uuidv4();
    const idNivelPuesto = uuidv4();
    const idContratacion = uuidv4();

    const idDiscriminacionSeccion2 = uuidv4();

    await queryInterface.bulkInsert('cuestionarios', [{
      id: cuestionarioId,
      titulo: 'DIAGNÓSTICO PARA CONTRIBUIR A LA IGUALDAD DE GÉNERO EN EL PODER LEGISLATIVO DEL ESTADO DE MÉXICO',
      descripcion: 'GENERO 2025',
      createdAt: new Date(), 
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('seccions', [
      { id: seccion1, titulo: 'DATOS GENERALES ', id_cuestionario: cuestionarioId, orden: 1, createdAt: new Date(), updatedAt: new Date()},
      { id: seccion2, titulo: 'AMBIENTE DE TRABAJO', id_cuestionario: cuestionarioId, orden: 2, createdAt: new Date(), updatedAt: new Date()},
      { id: seccion3, titulo: 'CONDICIONES LABORALES', id_cuestionario: cuestionarioId, orden: 3, createdAt: new Date(), updatedAt: new Date()},
      { id: seccion4, titulo: 'PERMANENCIA Y PROMOCIÓN', id_cuestionario: cuestionarioId, orden: 4, createdAt: new Date(), updatedAt: new Date()},
      { id: seccion5, titulo: 'SENSIBILIZACIÓN Y CAPACITACIÓN', id_cuestionario: cuestionarioId, orden: 5, createdAt: new Date(), updatedAt: new Date()},
      { id: seccion6, titulo: 'CORRESPONSABILIDAD ENTRE VIDA PERSONAL, FAMILIAR Y LABORAL', id_cuestionario: cuestionarioId, orden: 6, createdAt: new Date(), updatedAt: new Date()}
    ], {});


    await queryInterface.bulkInsert('preguntas', [
      { id: idSexo, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Sexo asignado al nacer', tipo: '1', orden: 1, createdAt: new Date(), updatedAt: new Date()},
      { id: idGenero, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Identidad de género', tipo: '1', orden: 2, createdAt: new Date(), updatedAt: new Date()},
      { id: idEdad, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Edad', tipo: '1', orden: 3, createdAt: new Date(), updatedAt: new Date()},
      { id: idEstadoCivil, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Estado civil', tipo: '1', orden: 4, createdAt: new Date(), updatedAt: new Date()},
      { id: idAntigPL, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Antigüedad en el Poder Legislativo', tipo: '1', orden: 5, createdAt: new Date(), updatedAt: new Date()},
      { id: idAntiPuestoPL, id_cuestionario: cuestionarioId, id_seccion: seccion1, texto_pregunta: 'Antigüedad en su puesto actual', tipo: '1', orden: 6, createdAt: new Date(), updatedAt: new Date()},

    ], {});

    const opcionesFrecuencia = ["Siempre", "Frecuentemente", "Algunas veces", "Nunca"];
    const opcionesInversa = ["Nunca", "Algunas veces", "Frecuentemente", "Siempre"];
    const opcionesSiNo = ["Sí", "Parcialmente", "Muy poco", "No"];
    const opcionesAscenso = ["Sí", "Si, pero no se concretó", "No", "No estoy en un puesto con posibilidad de ascenso"];
    const opcionesBinario = ["No", "Muy poco", "Parcialmente", "Sí"];

    const preguntasBase = [

      { seccion: seccion2, texto: "¿Considera que existe un ambiente de trabajo respetuoso y cordial en su espacio laboral?", opciones: opcionesFrecuencia },
      { seccion: seccion2, texto: "¿Su jefa o jefe directo promueve la igualdad entre hombres y mujeres?", opciones: opcionesFrecuencia },
      { seccion: seccion2, texto: "¿El trato entre personas de distinto sexo y cargo es respetuoso?", opciones: opcionesFrecuencia },
      { seccion: seccion2, texto: "¿Ha sido discriminada(o) en su espacio de trabajo?", opciones: opcionesInversa },
      { seccion: seccion2, texto: "Si la respuesta de la pregunta anterior es Frecuentemente o Siempre, seleccione la opción que le represente", opciones: ["Sexo","Edad","Discapacidad","Embarazo","Estado civil","Apariencia física","Orientación sexual","Identidad de género","Condición de salud","Otro"] },
      { seccion: seccion2, texto: "¿Ha observado expresiones, prácticas o actitudes que favorezcan en mayor medida a un sexo en detrimento del otro?", opciones: opcionesInversa },
      { seccion: seccion2, texto: "¿Se toma en cuenta por igual la opinión de hombres y mujeres?", opciones: opcionesFrecuencia },
      { seccion: seccion2, texto: "¿Las responsabilidades laborales son asignadas con equidad entre hombres y mujeres?", opciones: opcionesFrecuencia },
      { seccion: seccion2, texto: "¿Ha experimentado discriminación, violencia, hostigamiento laboral o acoso laboral en su espacio de trabajo?", opciones: opcionesInversa },
      { seccion: seccion2, texto: "¿La autoridad de hombres y mujeres se respeta por igual?", opciones: opcionesFrecuencia },


      { seccion: seccion3, texto: "¿Conoce sus derechos y prestaciones laborales?", opciones: opcionesSiNo },
      { seccion: seccion3, texto: "¿Considera que en su lugar de trabajo se respetan sus derechos y prestaciones laborales?", opciones: opcionesSiNo },
      { seccion: seccion3, texto: "¿Considera que hombres y mujeres tienen las mismas condiciones laborales?", opciones: opcionesSiNo },
      { seccion: seccion3, texto: "En su experiencia, ¿se toma en cuenta estereotipos de género al distribuir las actividades?", opciones: opcionesInversa },


      { seccion: seccion4, texto: "¿Considera que el género influye en la posibilidad de ascender?", opciones: opcionesInversa },
      { seccion: seccion4, texto: "¿Ha percibido que condiciones personales como: embarazo, tener hijas/os, o discapacidad han afectado la posibilidad de ascender?", opciones: opcionesInversa },
      { seccion: seccion4, texto: "¿Ha tenido oportunidades de crecimiento o ascenso?", opciones: opcionesAscenso },
      { seccion: seccion4, texto: "¿Considera que la rotación de personal se da más en mujeres?", opciones: opcionesBinario },

      { seccion: seccion5, texto: "¿La capacitación se ofrece por igual a hombres y mujeres?", opciones: opcionesFrecuencia },
      { seccion: seccion5, texto: "¿Ha recibido formación en temas de igualdad de género?", opciones: opcionesSiNo },
      { seccion: seccion5, texto: "¿Las capacitaciones que ha recibido le han permitido reflexionar sobre sus actitudes?", opciones: opcionesSiNo },
      { seccion: seccion5, texto: "¿Le interesa capacitarse en temas de derechos humanos y género?", opciones: opcionesSiNo },
      { seccion: seccion5, texto: "¿Cree que los temas de género son exclusivos para mujeres?", opciones: ["No","Muy poco","Parcialmente","Sí"] },


      { seccion: seccion6, texto: "¿Tiene bajo su cuidado a personas dependientes?", opciones: opcionesBinario },
      { seccion: seccion6, texto: "Si la respuesta de la pregunta anterior es Parcialmente o Si, seleccione la opción que le represente", opciones: ["Niñas/os","Personas adultas mayores","Personas con discapacidad","Otro"] },
      { seccion: seccion6, texto: "¿En su trabajo le brindan las facilidades para atender asuntos personales, familiares o en su caso, de cuidado de personas dependientes?", opciones: opcionesFrecuencia },
      { seccion: seccion6, texto: "¿Ha faltado al trabajo porque se le negó permiso para atender asuntos personales?", opciones: opcionesInversa }
    ];


    const preguntas = preguntasBase.map((p, i) => ({
      id: uuidv4(),
      id_cuestionario: cuestionarioId,
      id_seccion: p.seccion,
      texto_pregunta: p.texto,
      orden: i + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const opciones = preguntas.flatMap((pregunta, i) =>
      preguntasBase[i].opciones.map((texto, j) => ({
        id: uuidv4(),
        id_preguntas: pregunta.id,
        texto_opcion: texto,
        orden: j + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

        
    await queryInterface.bulkInsert('preguntas', preguntas, {});
    await queryInterface.bulkInsert('opciones', opciones, {});
    

    const opcionesRaw = [

      { id_preguntas: idSexo, texto_opcion: "Mujer" },
      { id_preguntas: idSexo, texto_opcion: "Hombre" },

      { id_preguntas: idGenero, texto_opcion: "Mujer" },
      { id_preguntas: idGenero, texto_opcion: "Hombre" },
      { id_preguntas: idGenero, texto_opcion: "No binario / género neutro" },
      { id_preguntas: idGenero, texto_opcion: "Prefiero no decirlo" },


      { id_preguntas: idEdad, texto_opcion: "18 a 20 años" },
      { id_preguntas: idEdad, texto_opcion: "21 a 30 años" },
      { id_preguntas: idEdad, texto_opcion: "31 a 40 años" },
      { id_preguntas: idEdad, texto_opcion: "41 a 50 años" },
      { id_preguntas: idEdad, texto_opcion: "51 a 65 años" },
      { id_preguntas: idEdad, texto_opcion: "66 años o más" },

      { id_preguntas: idEstadoCivil, texto_opcion: "Soltera(o)" },
      { id_preguntas: idEstadoCivil, texto_opcion: "Casada(o)" },
      { id_preguntas: idEstadoCivil, texto_opcion: "Concubinato" },
      { id_preguntas: idEstadoCivil, texto_opcion: "Divorciada(o)" },
      { id_preguntas: idEstadoCivil, texto_opcion: "Viuda(o)" },



      { id_preguntas: idAntigPL, texto_opcion: "Menos de 6 meses" },
      { id_preguntas: idAntigPL, texto_opcion: "De 6 meses a 1 año" },
      { id_preguntas: idAntigPL, texto_opcion: "De 1 a 3 años" },
      { id_preguntas: idAntigPL, texto_opcion: "De 3 a 6 años" },
      { id_preguntas: idAntigPL, texto_opcion: "De 6 a 10 años" },
      { id_preguntas: idAntigPL, texto_opcion: "Más de 10 años" },

      { id_preguntas: idAntiPuestoPL, texto_opcion: "Menos de 6 meses" },
      { id_preguntas: idAntiPuestoPL, texto_opcion: "De 6 meses a 1 año" },
      { id_preguntas: idAntiPuestoPL, texto_opcion: "De 1 a 3 años" },
      { id_preguntas: idAntiPuestoPL, texto_opcion: "De 3 a 6 años" },
      { id_preguntas: idAntiPuestoPL, texto_opcion: "De 6 a 10 años" },
      { id_preguntas: idAntiPuestoPL, texto_opcion: "Más de 10 años" },

    ];


    const opcionesConOrden = opcionesRaw.map((op, index, arr) => {
      const orden = arr.filter(o => o.id_preguntas === op.id_preguntas).indexOf(op) + 1;
      return {
        id: uuidv4(),
        id_preguntas: op.id_preguntas,
        texto_opcion: op.texto_opcion,
        orden: orden,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("opciones", opcionesConOrden, {});

    

    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
