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
    const {
      rollNumber, fullName, department, classValue, passedOutYear,
      postalAddress, email, semester, phone, date, feeReceiptNumber,
      amount, isPursuingHS, higherStudies, areYouPlaced, offerLetter,
      internship, letterOfJoining
    } = req.body;

    const sqlQueryStudent = "SELECT * FROM students WHERE rollNumber = ?";
    const studentValues = [rollNumber];

    try {
      const [studentResults] = await connection.promise().query(sqlQueryStudent, studentValues);

      if (studentResults.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const sqlUpdateStudent = `UPDATE students SET
        fullName = ?, classValue = ?, department = ?, passedOutYear = ?,
        postalAddress = ?, email = ?, semester = ?, phone = ?, date = ?,
        feeReceiptNumber = ?, amount = ?, isPursuingHS = ?, higherStudies = ?,
        areYouPlaced = ?, offerLetter = ?, internship = ?, letterOfJoining = ?,
        isFilled = ? WHERE rollNumber = ?`;

      const studentUpdateValues = [
        fullName, classValue, department, passedOutYear, postalAddress, email,
        semester, phone, date, feeReceiptNumber, amount, isPursuingHS,
        higherStudies, areYouPlaced === true ? 1 : 0, JSON.stringify(offerLetter),
        JSON.stringify(internship), JSON.stringify(letterOfJoining), true, rollNumber
      ];

      await connection.promise().query(sqlUpdateStudent, studentUpdateValues);
      return res.status(200).json({ message: 'Form submitted successfully' });
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
