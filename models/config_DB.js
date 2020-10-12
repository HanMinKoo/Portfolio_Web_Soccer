require('dotenv').config();

module.exports={
    host: process.env.DB_IP,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port	:process.env.DB_PORT,
    database	:process.env.DB_DATABASE,
    connectionLimit: 30
};