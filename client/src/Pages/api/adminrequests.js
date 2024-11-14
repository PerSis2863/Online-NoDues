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
    const { section } = req.body;

    if (!section) {
      return res.status(400).json({ message: 'Section is required' });
    }

    let sqlQuery;
    let values = [];

    // SQL query to fetch requests based on the section value
    if (section !== 'tpc') {
      sqlQuery = `SELECT * FROM requests WHERE ${section} = ?`;
      values = [false]; // Fetch requests where the section is false (not yet approved)
    } else if (section === 'tpc') {
      sqlQuery = `SELECT * FROM requests WHERE tpc = ?`;
      values = [false]; // Specifically for 'tpc', fetch requests that are false
    }

    try {
      const [results] = await connection.promise().query(sqlQuery, values);

      if (results.length === 0) {
        return res.status(404).json({ message: 'No requests found for the section' });
      }

      // If section is 'tpc', we want to enrich each request with student data
      if (section === 'tpc') {
        for (let i = 0; i < results.length; i++) {
          const studentQuery = 'SELECT * FROM students WHERE rollNumber = ?';
          const studentValues = [results[i].rollNumber];
          const [studentResult] = await connection.promise().query(studentQuery, studentValues);
          
          const student = studentResult[0];
          results[i] = {
            ...results[i],
            offerLetter: student?.offerLetter,
            internship: student?.internship,
            letterOfJoining: student?.letterOfJoining,
          };
        }
      }

      return res.status(200).json({
        success: true,
        requests: results,
      });
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
