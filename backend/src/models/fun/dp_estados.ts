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
import type { dp_datospersonales } from '../fun/dp_datospersonales';
import type { dp_municipios } from '../fun/dp_municipios';
import type { dp_paises } from '../fun/dp_paises';

export class dp_estados extends Model<
  InferAttributes<dp_estados>,
  InferCreationAttributes<dp_estados>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare pais: ForeignKey<dp_paises['id']>;

  // Associations
  declare pais_dp_paise?: NonAttribute<dp_paises>;
  declare dp_municipios?: NonAttribute<dp_municipios[]>;
  declare dp_datospersonales?: NonAttribute<dp_datospersonales[]>;

  static initModel(sequelize: Sequelize): typeof dp_estados {
    dp_estados.init(
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
        pais: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize: sequelizefun, // conexión específica
        tableName: 'dp_estados',
        timestamps: false,
        indexes: [
          { name: 'PRIMARY', unique: true, fields: ['id'] },
          { name: 'index_pais', fields: ['pais'] },
        ],
      }
    );

    return dp_estados;
  }

  static associate(models: {
    dp_paises: typeof dp_paises;
    dp_municipios: typeof dp_municipios;
    dp_datospersonales: typeof dp_datospersonales;
  }) {
    dp_estados.belongsTo(models.dp_paises, {
      foreignKey: 'pais',
      as: 'pais_dp_paise',
    });

    dp_estados.hasMany(models.dp_municipios, {
      foreignKey: 'estado',
      as: 'dp_municipios',
    });

    dp_estados.hasMany(models.dp_datospersonales, {
      foreignKey: 'estado_id',
      as: 'dp_datospersonales',
    });
  }
}
