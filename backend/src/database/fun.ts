import { Sequelize } from "sequelize"

const sequelizefun = new Sequelize('adminplem_administracion', 'usr_jornadasalud', 'P1OrpsDU6JqMtRDfGmqI', {
    host: '192.168.36.53',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})

export default sequelizefun 