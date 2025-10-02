import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from 'sequelize';

import sequelizefun from '../../database/fun'; // Conexión específica a 'administracion'
import { dp_colonias } from '../fun/dp_colonias';
import { dp_datospersonales } from '../fun/dp_datospersonales';
import { dp_estados } from '../fun/dp_estados';

export class dp_municipios extends Model<
  InferAttributes<dp_municipios>,
  InferCreationAttributes<dp_municipios>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare estado: ForeignKey<dp_estados['id']>;

  // Associations
  declare estado_dp_estado?: NonAttribute<dp_estados>;
  declare dp_colonia?: NonAttribute<dp_colonias[]>;
  declare dp_datospersonales?: NonAttribute<dp_datospersonales[]>;

  static initModel(sequelize: Sequelize): typeof dp_municipios {
    dp_municipios.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
        estado: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize: sequelizefun, // conexión específica
        tableName: 'dp_municipios',
        timestamps: false,
        indexes: [
          { name: 'PRIMARY', unique: true, fields: ['id'] },
          { name: 'index_estado', fields: ['estado'] },
        ],
      }
    );

    dp_municipios.belongsTo(dp_estados, {
      foreignKey: 'estado',
      as: 'estado_dp_estado',
    });


    return dp_municipios;
  }
}
