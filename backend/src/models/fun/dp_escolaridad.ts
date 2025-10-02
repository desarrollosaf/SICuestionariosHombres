import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';

import sequelizefun from '../../database/fun'; // Conexión específica a 'administracion'
import type { dp_datospersonales } from '../fun/dp_datospersonales';

export class dp_escolaridad extends Model<
  InferAttributes<dp_escolaridad>,
  InferCreationAttributes<dp_escolaridad>
> {
  declare id: CreationOptional<number>;
  declare escolaridad: string;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

  // Relaciones
  declare dp_datospersonales?: NonAttribute<dp_datospersonales[]>;
  declare getDp_datospersonales: HasManyGetAssociationsMixin<dp_datospersonales>;
  declare setDp_datospersonales: HasManySetAssociationsMixin<dp_datospersonales, number>;
  declare addDp_datospersonale: HasManyAddAssociationMixin<dp_datospersonales, number>;
  declare addDp_datospersonales: HasManyAddAssociationsMixin<dp_datospersonales, number>;
  declare createDp_datospersonale: HasManyCreateAssociationMixin<dp_datospersonales>;
  declare removeDp_datospersonale: HasManyRemoveAssociationMixin<dp_datospersonales, number>;
  declare removeDp_datospersonales: HasManyRemoveAssociationsMixin<dp_datospersonales, number>;
  declare hasDp_datospersonale: HasManyHasAssociationMixin<dp_datospersonales, number>;
  declare hasDp_datospersonales: HasManyHasAssociationsMixin<dp_datospersonales, number>;
  declare countDp_datospersonales: HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize): typeof dp_escolaridad {
    return dp_escolaridad.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        escolaridad: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize: sequelizefun, // conexión específica
        tableName: 'dp_escolaridad',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
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
