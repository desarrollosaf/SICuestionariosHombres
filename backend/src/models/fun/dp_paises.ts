import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';

import sequelizefun from '../../database/fun'; // Conexión específica a 'administracion'
import type { dp_estados } from '../fun/dp_estados';

export class dp_paises extends Model<
  InferAttributes<dp_paises, { omit: never }>,
  InferCreationAttributes<dp_paises, { omit: never }>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;

  // Relaciones
  declare dp_estados?: NonAttribute<dp_estados[]>;
  declare getDp_estados: HasManyGetAssociationsMixin<dp_estados>;
  declare setDp_estados: HasManySetAssociationsMixin<dp_estados, number>;
  declare addDp_estado: HasManyAddAssociationMixin<dp_estados, number>;
  declare addDp_estados: HasManyAddAssociationsMixin<dp_estados, number>;
  declare createDp_estado: HasManyCreateAssociationMixin<dp_estados>;
  declare removeDp_estado: HasManyRemoveAssociationMixin<dp_estados, number>;
  declare removeDp_estados: HasManyRemoveAssociationsMixin<dp_estados, number>;
  declare hasDp_estado: HasManyHasAssociationMixin<dp_estados, number>;
  declare hasDp_estados: HasManyHasAssociationsMixin<dp_estados, number>;
  declare countDp_estados: HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize): typeof dp_paises {
    return dp_paises.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize: sequelizefun, // conexión específica
        tableName: 'dp_paises',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
