'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('respuesta', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
       id_sesion: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sesion_cuestionarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_pregunta: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'preguntas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_opcion: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'opciones',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      valor_texto: {
        type: Sequelize.STRING
      },
      valor_numero: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('respuesta');
  }
};