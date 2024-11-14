import mysql from 'mysql2';

const dbConfig = {
  host: 'duesbridge-rds.c1wkmaomer43.ap-south-1.rds.amazonaws.com',
  user: 'aditya',
  password: 'Persistivinity2863',
  database: 'nodues',
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rollNumber } = req.body;

    // Validate input
    if (!rollNumber) {
      return res.status(400).json({ message: 'Missing rollNumber' });
    }

    // Query to retrieve the student's request data
    const sqlQuery = 'SELECT * FROM requests WHERE rollNumber = ?';
    const values = [rollNumber];

    try {
      const [results] = await connection.promise().query(sqlQuery, values);

      // Check if the student request exists
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      // Return the request data for the student
      return res.status(200).json({
        success: true,
        request: results[0],  // Assuming there's only one request per student
      });
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // If the HTTP method is not POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
