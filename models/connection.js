const mysql = require('mysql2/promise');

// ps: environment variables must be defined in a .env file

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

module.exports = connection;
