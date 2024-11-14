// lib/db.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function query(sql, values) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, values);
  connection.end();
  return results;
}
