import mysql from 'mysql2';

const dbConfig = {
  host: 'duesbridge-rds.c1wkmaomer43.ap-south-1.rds.amazonaws.com',
  user: 'aditya',
  password: 'Persistivinity2863',
  database: 'nodues',
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Query to retrieve all students
    const sqlQuery = 'SELECT * FROM students';

    try {
      const [results] = await connection.promise().query(sqlQuery);

      // Check if there are students in the database
      if (results.length === 0) {
        return res.status(404).json({ message: 'No students found' });
      }

      // Return the list of all students
      return res.status(200).json({
        success: true,
        students: results,
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
