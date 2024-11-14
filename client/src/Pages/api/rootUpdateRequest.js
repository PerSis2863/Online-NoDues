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
    const { rollNumber, section, value } = req.body;

    const sqlQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
    const values = [value, rollNumber];

    try {
      await connection.promise().query(sqlQuery, values);
      return res.status(200).json({ message: 'Section updated successfully' });
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
