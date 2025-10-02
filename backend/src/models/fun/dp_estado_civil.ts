import {
  Model,
  DataTypes,
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
import sequelize from '../../database/fun'; // conexión específica a la BD "administracion"
import type { dp_datospersonales } from './dp_datospersonales';

class DpEstadoCivil extends Model<
  InferAttributes<DpEstadoCivil>,
  InferCreationAttributes<DpEstadoCivil>
> {
  declare id: CreationOptional<number>;
  declare estado_civil: string;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

  // Relaciones (no obligatorias para funcionalidad básica)
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
}

DpEstadoCivil.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    estado_civil: {
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
    sequelize,
    tableName: 'dp_estado_civil',
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
        fields: ['id'],
      },
    ],
  }
);

export default DpEstadoCivil;
