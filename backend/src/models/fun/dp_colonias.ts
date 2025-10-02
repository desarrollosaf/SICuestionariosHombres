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

import sequelizefun from '../../database/fun';
import { dp_municipios } from '../fun/dp_municipios';
import { dp_datospersonales } from '../fun/dp_datospersonales';

export class dp_colonias extends Model<
  InferAttributes<dp_colonias>,
  InferCreationAttributes<dp_colonias>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare ciudad?: string;
  declare municipio?: ForeignKey<dp_municipios['id']>;
  declare asentamiento?: string;
  declare codigo_postal?: number;

  // Relaciones
  declare municipio_dp_municipio?: NonAttribute<dp_municipios>;
  declare dp_datospersonales?: NonAttribute<dp_datospersonales[]>;

  static initModel(sequelize: Sequelize): typeof dp_colonias {
    dp_colonias.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: '',
        },
        ciudad: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        municipio: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        asentamiento: {
          type: DataTypes.STRING(25),
          allowNull: true,
        },
        codigo_postal: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
      },
      {
        sequelize: sequelizefun, // conexión específica
        tableName: 'dp_colonias',
        timestamps: false,
        indexes: [
          { name: 'PRIMARY', unique: true, fields: ['id'] },
          { name: 'index_municipio', fields: ['municipio'] },
          { name: 'index_nombre', fields: ['nombre'] },
          { name: 'index_asentamiento', fields: ['asentamiento'] },
          { name: 'index_codigo_postal', fields: ['codigo_postal'] },
          { name: 'index_ciudad', fields: ['ciudad'] },
        ],
      }
    );


    
     dp_colonias.belongsTo(dp_municipios, {
      foreignKey: 'municipio',
      as: 'municipio_dp_municipio',
    });

    return dp_colonias;
  }
  
  
}
