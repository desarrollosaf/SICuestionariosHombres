'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sedes', [
      {
        sede: 'Camara de diputados',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sede: 'Santader',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sedes', null, {});
  }
};

