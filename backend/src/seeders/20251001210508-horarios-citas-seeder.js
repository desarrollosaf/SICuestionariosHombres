'use strict';

const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Iniciando Seeder de horarios_citas desde CSV...");

    // Ruta del CSV (ajusta según donde esté tu archivo)
    const csvFilePath = path.resolve(__dirname, '../database/catalogos/horario2.csv');

    // Vaciar tabla antes de insertar
    await queryInterface.bulkDelete('horarios_citas', null, {});

    const horarios = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser({ headers: ['hora_inicio', 'hora_fin'], skipLines: 1 })) // Si CSV tiene header
        .on('data', (row) => {
          horarios.push({
            horario_inicio: row.hora_inicio,
            horario_fin: row.hora_fin,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        })
        .on('end', async () => {
          console.log(`Se encontraron ${horarios.length} horarios en el CSV.`);
          if (horarios.length > 0) {
            await queryInterface.bulkInsert('horarios_citas', horarios, {});
          }
          console.log("Seeder completado.");
          resolve();
        })
        .on('error', (error) => {
          console.error("Error leyendo el CSV:", error);
          reject(error);
        });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('horarios_citas', null, {});
  }
};

