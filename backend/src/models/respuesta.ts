import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import sequelize from '../database/cuestionariosConnection';
import sesion from './sesion_cuestionario';

class respuestas extends Model<
  InferAttributes<respuestas>,
  InferCreationAttributes<respuestas>
> {
    declare id: CreationOptional<string>;
    declare id_sesion: ForeignKey<string>;
    declare id_pregunta: ForeignKey<string>;
    declare id_opcion: ForeignKey<string>;
    declare valor_texto?: string | null;
    declare valor_numero?: string| null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    
    declare m_sesion?: sesion[];
}

respuestas.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
        },
        id_sesion: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_pregunta: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_opcion: {
            type: DataTypes.UUID,
            allowNull: false
        },
        valor_texto: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        valor_numero: {
            type: DataTypes.STRING(255),
            allowNull: false
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
        tableName: 'respuesta',
        timestamps: false,
    }
)

respuestas.belongsTo(sesion, {
  foreignKey: "id_sesion", as: "m_sesion"
}) 

export default respuestas;