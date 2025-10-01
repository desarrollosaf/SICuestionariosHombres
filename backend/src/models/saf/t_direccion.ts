import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../database/connection'; 

class Direccion extends Model<
  InferAttributes<Direccion>,
  InferCreationAttributes<Direccion>
> {
  declare id_Direccion: CreationOptional<number>;
  declare C_presupDir: number;
  declare Nombre: string;
  declare F_Creacion: string;
  declare U_Modificacion: string;
  declare Estado: number;
  declare Creado: number;
  declare id_Dependencia: number | null;
  declare c_presup: number | null;
  declare nombre_completo: string | null;
}

Direccion.init(
  {
    id_Direccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_Direccion'
    },
    C_presupDir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'C_presupDir'
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Nombre'
    },
    F_Creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'F_Creacion'
    },
    U_Modificacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'U_Modificacion'
    },
    Estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Estado'
    },
    Creado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Creado'
    },
    id_Dependencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_Dependencia'
    },
    c_presup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'c_presup'
    },
    nombre_completo: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  
  {
    sequelize,
    tableName: 't_direccion',
    timestamps: false,
    indexes: [
      {
        name: 'id_Direccion',
        using: 'BTREE',
        fields: [{ name: 'id_Direccion' }],
      },
    ],
    
  }
);

export default Direccion;
