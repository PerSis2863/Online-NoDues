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
    const { rollNumber, password } = req.body;

    const sqlQuery = "SELECT * FROM students WHERE rollNumber = ?";
    const values = [rollNumber];

    try {
      const [results] = await connection.promise().query(sqlQuery, values);

      if (results.length === 0) {
        const newStudent = {
          rollNumber,
          password: 'dypatil@123',
          fullName: '',
          department: '',
          classValue: '',
          passedOutYear: '',
          postalAddress: '',
          email: '',
          semester: '',
          phone: '',
          date: null,
          feeReceiptNumber: '',
          amount: '',
          areYouPlaced: false,
          offerLetter: JSON.stringify({}),
          internship: JSON.stringify({}),
          letterOfJoining: JSON.stringify({}),
          isFilled: false,
          isCompleted: false
        };

        const insertQuery = "INSERT INTO students SET ?";
        await connection.promise().query(insertQuery, newStudent);

        return res.status(200).json({ authenticated: true, created: true });
      } else {
        if (results[0].password === password) {
          return res.status(200).json({ authenticated: true, created: false });
        } else {
          return res.status(401).json({ authenticated: false });
        }
      }
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
