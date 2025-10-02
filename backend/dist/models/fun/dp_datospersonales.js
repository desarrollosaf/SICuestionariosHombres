"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_datospersonales = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun"));
class dp_datospersonales extends sequelize_1.Model {
    static initModel(sequelize) {
        dp_datospersonales.init({
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            f_nombre: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            f_primer_apellido: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            f_segundo_apellido: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_curp: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            f_rfc: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            f_homclave: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_sexo: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_clave_issemym: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_fecha_nacimiento: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_entidad: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_domicilio: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_colonia: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_cedula: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_cp: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_cuenta_bancaria: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            f_municipio: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            numint: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            numext: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            correo_ins: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            correo_per: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            numero_tel: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            numero_cel: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            fecha_escolaridad: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            area_escolaridad: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            estadocivil_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            sindicalizado_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            sci_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            escolaridad_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            estado_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            municipio_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            colonia_id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize: fun_1.default,
            tableName: 'dp_datospersonales',
            timestamps: false,
            paranoid: true,
            underscored: true,
        });
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
exports.dp_datospersonales = dp_datospersonales;
