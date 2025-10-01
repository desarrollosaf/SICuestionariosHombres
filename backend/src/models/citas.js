'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class citas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  citas.init({
    horario_id: DataTypes.STRING,
    sede_id: DataTypes.STRING,
    rfc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'citas',
  });
  return citas;
};
