import SUsuario from "./models/saf/s_usuario"
import Departamento from "./models/saf/t_departamento"
import Dependencia from "./models/saf/t_dependencia"
import Direccion from "./models/saf/t_direccion"
import Server from "./models/server"
import sesion from "./models/sesion_cuestionario"

const server =  new Server()

const models = {
    SUsuario,
    Dependencia, 
    Direccion,
    Departamento,
    sesion
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;