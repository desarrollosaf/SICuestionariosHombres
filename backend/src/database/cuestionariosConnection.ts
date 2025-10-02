import { Sequelize } from "sequelize"

const sequelizeCuestionarios = new Sequelize('adminplem_jornadaSalud', 'usr_jornadasalud', 'P1OrpsDU6JqMtRDfGmqI', {
    host: '192.168.36.53',
    dialect: 'mysql',
    define: {
        freezeTableName: true 
    }
})
export default sequelizeCuestionarios 
