const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Created Database in MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yoga_database', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const enrolledParticipants = [];

app.post('/api/enroll', (req, res) => {
  const { name, age, selectedBatch } = req.body;

  // Basic validations...

  // Check if the participant already exists
  pool.query(
    'SELECT * FROM Participants WHERE name = ? AND selectedBatch = ?',
    [name, selectedBatch],
    (error, results) => {
      if (error) {
        console.error('Error executing select query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If participant already exists, respond with an error
      if (results.length > 0) {
        return res.status(400).json({ error: 'Participant already enrolled in the selected batch' });
      }

      // Continue with the enrollment process if the participant doesn't exist
      pool.query(
        'INSERT INTO Participants (name, age, selectedBatch) VALUES (?, ?, ?)',
        [name, age, selectedBatch],
        (insertError) => {
          if (insertError) {
            console.error('Error executing insert query:', insertError);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Mock payment function...
          const paymentResponse = CompletePayment(name, selectedBatch);

          if (paymentResponse.success) {
            res.status(200).json({ message: 'Enrollment successful', paymentResponse });
          } else {
            res.status(500).json({ error: 'Payment failed', paymentResponse });
          }
        }
      );
    }
  );
});

// app.post('/api/enroll', (req, res) => {
//   const { name, age, selectedBatch } = req.body;

//   // Basic validations
//   if (!name || !age || !selectedBatch) {
//     return res.status(400).json({ error: 'Please fill in all the fields' });
//   }

//   // Age limit check
//   const ageInt = parseInt(age);
//   if (ageInt < 18 || ageInt > 65) {
//     return res.status(400).json({ error: 'Age must be between 18 and 65' });
//   }

//   // Store data in the database 
//   enrolledParticipants.push({ name, age, selectedBatch });

//   pool.query('INSERT INTO Participants (name, age, selectedBatch) VALUES (?, ?, ?)', [name, age, selectedBatch], (error) => {

//     if (error) {
//         console.error('Error executing insert query:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
//     })

//   // Mock payment function (you would replace this with your actual payment logic)
//   const paymentResponse = CompletePayment(name, selectedBatch);

//   const success = Math.random() < 0.8; // 80% success rate, change as needed
//   return { success, message: success ? 'Payment successful' : 'Payment failed' };


// });


  //   if (paymentResponse.success) {
  //     return res.status(200).json({ message: 'Enrollment successful' });
  //   } else {
  //     return res.status(500).json({ error: 'Payment failed' });
  //   }
  // });


// Getting Enrolled Participants

app.get('/api/enrolled-participants', (req, res) => {
  // Use the connection pool to execute a query
  pool.query('SELECT * FROM Participants', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json(results);
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Mock Payment Function
function CompletePayment(name, selectedBatch) {
  console.log(`Payment successful for ${name} in batch ${selectedBatch}`);
  return { success: true };
}
