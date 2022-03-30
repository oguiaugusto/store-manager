const mysql = require('mysql2/promise');

// ps1: user and password must be exported using cli:
// export MYSQL_USER=your_user MYSQL_PASSWORD=your_password

// ps2: host and port must be defined in a .env file

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

module.exports = connection;
