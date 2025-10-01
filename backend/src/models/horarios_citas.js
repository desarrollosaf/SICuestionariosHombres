'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class horarios_citas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  horarios_citas.init({
    horario_inicio: DataTypes.STRING,
    horario_fin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'horarios_citas',
  });
  return horarios_citas;
};
