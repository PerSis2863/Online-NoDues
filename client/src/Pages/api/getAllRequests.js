import mysql from 'mysql2';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Query to retrieve all requests
    const sqlQuery = 'SELECT * FROM requests';

    try {
      const [results] = await connection.promise().query(sqlQuery);

      // Check if there are requests in the database
      if (results.length === 0) {
        return res.status(404).json({ message: 'No requests found' });
      }

      // Return the list of all requests
      return res.status(200).json({
        success: true,
        requests: results,
      });
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // If the HTTP method is not GET
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
