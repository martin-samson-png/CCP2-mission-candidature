import mysql2 from "mysql2/promise";

/**
 * @typedef {Object} Pool - Instance de connexion MySQL (créée via mysql2/promise)
 */

/**
 * @description Crée et renvoie un pool de connexions à la base de données MariaDB/MySQL.
 *
 * @returns {Pool} Instance de connexion MySQL
 *
 * @example
 * import getPool from "./database.js";
 *
 * const pool = getPool();
 * const [rows] = await pool.query("SELECT * FROM users");
 */
const getPool = () => {
  try {
    const pool = mysql2.createPool({
      host: process.env.MARIA_HOST,
      user: process.env.MARIA_USER,
      password: process.env.MARIA_PASSWORD,
      database: process.env.MARIA_DB,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    return pool;
  } catch (err) {
    console.error(err.message);
  }
};

export default getPool;
