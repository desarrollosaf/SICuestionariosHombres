'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('citas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      horario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'horarios_citas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sede_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sedes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rfc: {
        type: Sequelize.STRING
      },
      fecha_cita: {
        type: Sequelize.DATEONLY
      },
      correo: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      folio: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('citas');
  }
};

