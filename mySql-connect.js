const mysql = require("mysql2");

const pool = mysql.createPool({
<<<<<<< HEAD
  host: "localhost",
  user: "root",
  password: "1234",
  database: "wow-gym",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
=======
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "wow-gym",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TABLE,
>>>>>>> e73063d3ca48abaf16a0d0c3c3b5653f512a30b0
});

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_TABLE,
// });

module.exports = pool.promise();
