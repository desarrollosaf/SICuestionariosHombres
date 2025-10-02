import { Sequelize } from "sequelize"

const sequelizefun = new Sequelize('administracion', 'homestead', 'secret', {
    host: '192.168.10.10',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})

export default sequelizefun 