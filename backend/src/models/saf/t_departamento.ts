import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../database/connection'; 

class Departamento extends Model<
  InferAttributes<Departamento>,
  InferCreationAttributes<Departamento>
> {
  declare id_Departamento: CreationOptional<number>;
  declare C_presupDepto: number;
  declare Nombre: string;
  declare Creado: number;
  declare F_Creacion: string;
  declare U_Modificacion: string;
  declare Estado: number;
  declare id_Dependencia: number | null;
  declare id_Direccion: number | null;
  declare c_presup: number;
  declare nombre_completo: string | null;
  // declare nom_cap: string | null;
}


Departamento.init(
  {
    id_Departamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
       field: 'id_Departamento'
    },
    C_presupDepto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'C_presupDepto'
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Nombre'
    },
    Creado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Creado'
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
    id_Dependencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_Dependencia'
    },
    id_Direccion: {
      type: DataTypes.INTEGER,
      allowNull: true,
       field: 'id_Direccion'
    },
    c_presup: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // nom_cap: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    tableName: 't_departamento',
    timestamps: false,
    indexes: [
      {
        name: 'id_Departamento',
        using: 'BTREE',
        fields: [{ name: 'id_Departamento' }],
      },
    ],
  }
);


export default Departamento;
