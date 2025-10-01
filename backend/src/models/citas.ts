import { Model, DataTypes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../database/cuestionariosConnection';
import HorarioCita from './horarios_citas';
import Sede from './sedes';

class Cita extends Model {
  declare id: CreationOptional<number>;
  declare horario_id: ForeignKey<number>;
  declare sede_id: ForeignKey<number>;
  declare rfc: string | null;
  declare fecha_cita: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Cita.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    horario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sede_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rfc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_cita: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'citas',
    timestamps: true,
  }
);

// 👇 Asociaciones
Cita.belongsTo(HorarioCita, { foreignKey: 'horario_id', as: 'horario' });
Cita.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' });

export default Cita;
