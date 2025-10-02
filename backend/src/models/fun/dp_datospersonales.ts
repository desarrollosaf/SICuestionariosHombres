import {
  Model,
  DataTypes,
  Sequelize,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize';
import sequelizefun from '../../database/fun';
import { dp_colonias } from '../fun/dp_colonias';
import { dp_escolaridad } from '../fun/dp_escolaridad';
import dp_estado_civil from '../fun/dp_estado_civil';
import { dp_estados } from '../fun/dp_estados';
import { dp_municipios } from '../fun/dp_municipios';
import { dp_opciones } from '../fun/dp_opciones';
import DpEstadoCivil from '../fun/dp_estado_civil';

export class dp_datospersonales extends Model<
  InferAttributes<dp_datospersonales>,
  InferCreationAttributes<dp_datospersonales>
> {
  declare id: CreationOptional<number>;
  declare f_nombre: string | null;
  declare f_primer_apellido: string | null;
  declare f_segundo_apellido?: string | null;
  declare f_curp: string | null;
  declare f_rfc: string | null;
  declare f_homclave?: string | null;
  declare f_sexo?: string | null;
  declare f_clave_issemym?: string | null;
  declare f_fecha_nacimiento?: string | null;
  declare f_entidad?: string | null;
  declare f_domicilio?: string | null;
  declare f_colonia?: string | null;
  declare f_cedula?: string | null;
  declare f_cp?: string | null;
  declare f_cuenta_bancaria?: string | null;
  declare f_municipio?: string | null;
  declare numint?: string | null;
  declare numext?: string | null;
  declare correo_ins?: string | null;
  declare correo_per?: string | null;
  declare numero_tel?: string | null;
  declare numero_cel?: string | null;
  declare fecha_escolaridad?: string | null;
  declare area_escolaridad?: string | null;

  // Timestamps & Paranoid
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

  // Foreign Keys
  declare estadocivil_id?: ForeignKey<number> | null;
  declare sindicalizado_id?: ForeignKey<number> | null;
  declare sci_id?: ForeignKey<number> | null;
  declare escolaridad_id?: ForeignKey<number> | null;
  declare estado_id?: ForeignKey<number> | null;
  declare municipio_id?: ForeignKey<number> | null;
  declare colonia_id?: ForeignKey<number> | null;

  // Associations
  declare estado?: NonAttribute<dp_estados> | null;
  declare municipio?: NonAttribute<dp_municipios> | null;
  declare colonia?: NonAttribute<dp_colonias> | null;
  declare escolaridad?: NonAttribute<dp_escolaridad> | null;
  declare estadocivil?: NonAttribute<dp_estado_civil> | null;
  declare sindicalizado?: NonAttribute<dp_opciones> | null;
  declare sci?: NonAttribute<dp_opciones> | null;

  static initModel(sequelize: Sequelize): typeof dp_datospersonales {
    dp_datospersonales.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        f_nombre: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        f_primer_apellido: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        f_segundo_apellido: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_curp: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        f_rfc: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        f_homclave: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_sexo: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_clave_issemym: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_fecha_nacimiento: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_entidad: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_domicilio: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_colonia: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_cedula: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_cp: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_cuenta_bancaria: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        f_municipio: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        numint: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        numext: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        correo_ins: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        correo_per: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        numero_tel: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        numero_cel: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        fecha_escolaridad: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        area_escolaridad: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        estadocivil_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        sindicalizado_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        sci_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        escolaridad_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        estado_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        municipio_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
        },
        colonia_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true,
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
        sequelize: sequelizefun,
        tableName: 'dp_datospersonales',
        timestamps: false,
        paranoid: true,
        underscored: true,
      }
    );

    /*dp_datospersonales.belongsTo(dp_colonias, {
      foreignKey: 'colonia_id',
      as: 'colonia',
    });

    dp_datospersonales.belongsTo(dp_estados, { foreignKey: 'estado_id', as: 'estado' });
    dp_datospersonales.belongsTo(dp_municipios, { foreignKey: 'municipio_id', as: 'municipio' });
    dp_datospersonales.belongsTo(DpEstadoCivil, { foreignKey: 'estadocivil_id', as: 'estadocivil' });*/
    return dp_datospersonales;
  }
}
