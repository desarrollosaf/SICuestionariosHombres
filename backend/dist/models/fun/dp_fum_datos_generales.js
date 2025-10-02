"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dp_fum_datos_generales = void 0;
const sequelize_1 = require("sequelize");
const fun_1 = __importDefault(require("../../database/fun")); // Ajusta la ruta si es necesario
class dp_fum_datos_generales extends sequelize_1.Model {
    static initModel(sequelize) {
        dp_fum_datos_generales.init({
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            f_nombre: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_primer_apellido: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_segundo_apellido: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_curp: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_rfc: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_homclave: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_sexo: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_clave_issemym: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_fecha_nacimiento: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_entidad: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_sci: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_estado_civil: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_escolaridad: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_domicilio: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_colonia: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_cedula: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_cp: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_cuenta_bancaria: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            f_municipio: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            funciones_p: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            num_int: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            num_ext: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
            createdAt: {
                field: 'created_at',
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            updatedAt: {
                field: 'updated_at',
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            deletedAt: {
                field: 'deleted_at',
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize: fun_1.default,
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
        });
        return dp_fum_datos_generales;
    }
    // Puedes declarar asociaciones aquí en el futuro
    static associate(models) {
        // ejemplo:
        // this.belongsTo(models.otra_tabla, { foreignKey: 'campo', as: 'alias' });
    }
}
exports.dp_fum_datos_generales = dp_fum_datos_generales;
