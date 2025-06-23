require('dotenv').config();
const mysql = require('mysql2');

const dbName = process.env.DB_NAME;

const basePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
});

// Create a ready-to-use pool variable
let exportedPool;

// Helper to ensure DB and Table exist
const ensureDbAndTable = () => {
  return new Promise((resolve, reject) => {
    basePool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
      if (err) return reject(err);

      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      pool.query(
        `CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          quantity INT
        )`, (err) => {
          if (err) return reject(err);
          resolve(pool);
        }
      );
    });
  });
};

// Immediately start init (at module load time)
ensureDbAndTable()
  .then(pool => {
    exportedPool = pool;
    console.log("✅ Table ready, exporting pool");
  })
  .catch(err => {
    console.error("❌ DB/Table setup failed:", err);
    process.exit(1);
  });

// Export a Proxy that always uses the real pool (after it’s ready)
module.exports = new Proxy({}, {
  get(target, prop) {
    if (!exportedPool) throw new Error("DB pool not ready yet!");
    return exportedPool[prop];
  }
});
