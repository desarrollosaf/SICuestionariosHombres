import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import sequelize from '../database/cuestionariosConnection';
import preguntas from './preguntas';
import opciones from './opciones';
import SUsuario from './saf/s_usuario';

class sesion extends Model<
  InferAttributes<sesion>,
  InferCreationAttributes<sesion>
> {
    declare id: CreationOptional<string>;
    declare id_usuario: string;
    declare fecha_registro: Date;
    declare comentarios: string | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
}

sesion.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
        },
        id_usuario: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        fecha_registro: {
            type: DataTypes.DATE,
            allowNull: true
        },
        comentarios: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'sesion_cuestionarios',
        timestamps: false,
    }
);



export default sesion;