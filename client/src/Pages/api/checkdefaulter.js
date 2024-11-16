import mysql from 'mysql2';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rollNumber } = req.body;

    const sqlQuery = "SELECT * FROM defaulters WHERE rollNumber = ?";
    const values = [rollNumber];

    try {
      const [results] = await connection.promise().query(sqlQuery, values);

      if (results.length === 0) {
        const updateQuery = "UPDATE requests SET deplabs = ?, commonlabs = ?, accounts = ?, exam = ?, library = ?, deplib = ?, store = ?, tpc = ? WHERE rollNumber = ?";
        const updateValues = [0, 0, 0, 0, 0, 0, 0, 0, rollNumber];

        await connection.promise().query(updateQuery, updateValues);
        return res.status(200).json({ message: 'All sections updated to true for non-defaulter' });
      } else {
        const defaulter = results[0];
        const sectionsToUpdate = [];

        for (const [key, value] of Object.entries(defaulter)) {
          if (key !== "rollNumber" && value === 0) {
            sectionsToUpdate.push(key);
          }
        }

        for (const section of sectionsToUpdate) {
          if (section !== "tpc") {
            const updateQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
            const updateValues = [1, rollNumber];
            await connection.promise().query(updateQuery, updateValues);
          }
        }

        return res.status(200).json({ updatedSections: sectionsToUpdate, defaulter });
      }
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
