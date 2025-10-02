import { Sequelize } from "sequelize"

const sequelize = new Sequelize('adminplem_saf', 'homestead', 'secret', {
    host: '192.168.10.10',
    dialect: 'mysql',
    define: {
        freezeTableName: true 
    }
})

export default sequelize 
 