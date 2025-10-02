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

export class dp_opciones extends Model<
  InferAttributes<dp_opciones>,
  InferCreationAttributes<dp_opciones>
> {
  declare id: CreationOptional<number>;
  declare opcion: string;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

  // Relaciones: sindicalizado_id
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

  // Relaciones: sci_id
  declare sci_dp_datospersonales?: NonAttribute<dp_datospersonales[]>;
  declare getSci_dp_datospersonales: HasManyGetAssociationsMixin<dp_datospersonales>;
  declare setSci_dp_datospersonales: HasManySetAssociationsMixin<dp_datospersonales, number>;
  declare addSci_dp_datospersonale: HasManyAddAssociationMixin<dp_datospersonales, number>;
  declare addSci_dp_datospersonales: HasManyAddAssociationsMixin<dp_datospersonales, number>;
  declare createSci_dp_datospersonale: HasManyCreateAssociationMixin<dp_datospersonales>;
  declare removeSci_dp_datospersonale: HasManyRemoveAssociationMixin<dp_datospersonales, number>;
  declare removeSci_dp_datospersonales: HasManyRemoveAssociationsMixin<dp_datospersonales, number>;
  declare hasSci_dp_datospersonale: HasManyHasAssociationMixin<dp_datospersonales, number>;
  declare hasSci_dp_datospersonales: HasManyHasAssociationsMixin<dp_datospersonales, number>;
  declare countSci_dp_datospersonales: HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize): typeof dp_opciones {
    return dp_opciones.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        opcion: {
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
        tableName: 'dp_opciones',
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
