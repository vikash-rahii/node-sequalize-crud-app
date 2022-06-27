
module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DATABASE,
  dialect: process.env.DIALECT,
  pool: {
    max: 5,//maximum number of connection in pool
    min: 0,//minimum number of connection in pool
    acquire: 30000,
    idle: 10000
  }
};