import {
  Model,
  DataTypes,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

import sequelizefun from '../../database/fun'; // Ajusta la ruta si es necesario

export class dp_fum_datos_generales extends Model<
  InferAttributes<dp_fum_datos_generales>,
  InferCreationAttributes<dp_fum_datos_generales>
> {
  declare id: CreationOptional<number>;
  declare f_nombre: string | null;
  declare f_primer_apellido: string | null;
  declare f_segundo_apellido: string | null;
  declare f_curp: string | null;
  declare f_rfc: string | null;
  declare f_homclave: string | null;
  declare f_sexo: string | null;
  declare f_clave_issemym: string | null;
  declare f_fecha_nacimiento: string | null;
  declare f_entidad: string | null;
  declare f_sci: string | null;
  declare f_estado_civil: string | null;
  declare f_escolaridad: string | null;
  declare f_domicilio: string | null;
  declare f_colonia: string | null;
  declare f_cedula: string | null;
  declare f_cp: string | null;
  declare f_cuenta_bancaria: string | null;
  declare f_municipio: string | null;
  declare funciones_p: string | null;
  declare num_int: string | null;
  declare num_ext: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  static initModel(sequelize: Sequelize): typeof dp_fum_datos_generales {
    dp_fum_datos_generales.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        f_nombre: { type: DataTypes.STRING(255), allowNull: true },
        f_primer_apellido: { type: DataTypes.STRING(255), allowNull: true },
        f_segundo_apellido: { type: DataTypes.STRING(255), allowNull: true },
        f_curp: { type: DataTypes.STRING(255), allowNull: true },
        f_rfc: { type: DataTypes.STRING(255), allowNull: true },
        f_homclave: { type: DataTypes.STRING(255), allowNull: true },
        f_sexo: { type: DataTypes.STRING(255), allowNull: true },
        f_clave_issemym: { type: DataTypes.STRING(255), allowNull: true },
        f_fecha_nacimiento: { type: DataTypes.STRING(255), allowNull: true },
        f_entidad: { type: DataTypes.STRING(255), allowNull: true },
        f_sci: { type: DataTypes.STRING(255), allowNull: true },
        f_estado_civil: { type: DataTypes.STRING(255), allowNull: true },
        f_escolaridad: { type: DataTypes.STRING(255), allowNull: true },
        f_domicilio: { type: DataTypes.STRING(255), allowNull: true },
        f_colonia: { type: DataTypes.STRING(255), allowNull: true },
        f_cedula: { type: DataTypes.STRING(255), allowNull: true },
        f_cp: { type: DataTypes.STRING(255), allowNull: true },
        f_cuenta_bancaria: { type: DataTypes.STRING(255), allowNull: true },
        f_municipio: { type: DataTypes.STRING(255), allowNull: true },
        funciones_p: { type: DataTypes.TEXT, allowNull: true },
        num_int: { type: DataTypes.STRING(255), allowNull: true },
        num_ext: { type: DataTypes.STRING(255), allowNull: true },
        createdAt: {
          field: 'created_at', 
          type: DataTypes.DATE,
          allowNull: true,
        },
        updatedAt: {
          field: 'updated_at', 
          type: DataTypes.DATE,
          allowNull: true,
        },
        deletedAt: {
          field: 'deleted_at', 
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize: sequelizefun,
        tableName: 'dp_fum_datos_generales',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            fields: ['id'],
          },
        ],
      }
    );

    return dp_fum_datos_generales;
  }

  // Puedes declarar asociaciones aquí en el futuro
  static associate(models: Record<string, any>) {
    // ejemplo:
    // this.belongsTo(models.otra_tabla, { foreignKey: 'campo', as: 'alias' });
  }
}
