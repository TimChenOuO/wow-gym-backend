const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "wow-gym",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_TABLE,
// });

// production config
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "wow-gym",
// });

module.exports = pool.promise();
