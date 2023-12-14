require('dotenv').config()

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  port: "3306",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  userName:process.env.EMAIL_ADDRESS,
  EmailPassword: process.env.EMAIL_PASSWORD,
  service: "gmail",
};