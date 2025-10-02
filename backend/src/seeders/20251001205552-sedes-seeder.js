'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sedes', [
      {
        sede: 'Congreso del Estado de Mexico',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sede: 'Voluntariado del Congreso del Estado de Mexico',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sedes', null, {});
  }
};

