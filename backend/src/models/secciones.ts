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

class seccion extends Model<
  InferAttributes<seccion>,
  InferCreationAttributes<seccion>
> {
    declare id: string;
    declare id_cuestionario: string;
    declare titulo: string;
    declare orden: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
    declare deletedAt?: Date;

    declare m_preguntas?: preguntas[];
}

seccion.init(
    {
        id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
        },
         id_cuestionario: {
            type: DataTypes.UUID,
            allowNull: false
        },
         titulo: {
            type: DataTypes.STRING(255),
            allowNull: false
        }, 
        orden: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
    },
    {
        sequelize,
        tableName: 'seccions',
        timestamps: false,
    }
);

seccion.hasMany(preguntas,{
    foreignKey: "id_seccion", as: "m_preguntas"
});

preguntas.hasMany(opciones,{
    foreignKey: "id_preguntas", as: "m_opciones"
})



export default seccion;