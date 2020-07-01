const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "gym-project",
// });

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_TABLE,
// });

// production config

const pool = mysql.createPool({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b7aafd89bf2851",
  password: "633fdffc",
  database: "heroku_a97c1aaa6daa789",
});

module.exports = pool.promise();

// -------
