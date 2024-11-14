import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Establish a connection to MySQL
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Query the database
    const [rows] = await dbConnection.execute('SELECT * FROM your_table LIMIT 10');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query error' });
  } finally {
    // Close the connection after the query
    await dbConnection.end();
  }
}
