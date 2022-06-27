const dbConfig = require("../config/connection");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
        operatorsAliases: false
    },
});

sequelize.authenticate()
    .then(() => {
        console.log('Database Connection has been established successfully!')
    })
    .catch(err => {
        console.log('Unable to connect to the database' + err)
    })


// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })


db.tutorials = require("./tudoModel")(sequelize, Sequelize);
module.exports = db;