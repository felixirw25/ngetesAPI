const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Create an Express.js application
const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve database connection information from environment variables
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Create a MySQL database connection
const dbConnection = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

// Connect to the database
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Function to calculate square root using JavaScript
function calculateSquareRoot(numbers) {
  return Math.sqrt(numbers);
}

// Define a route for handling GET requests
app.get('/calculateSquareRoot', (req, res) => {
  const numbers = parseFloat(req.query.numbers);

  if (isNaN(numbers)) {
    return res.status(400).json({ error: 'Invalid "numbers" parameter' });
  }

  const squareRoot = calculateSquareRoot(numbers);

  // Insert the numbers and square root into the database
  const insertSql = `INSERT INTO tb_sqnumbers (numbers, sqnumber) VALUES (${numbers}, ${squareRoot})`;

  dbConnection.query(insertSql, (err) => {
    if (err) {
      console.error('Error updating the database:', err);
      return res.status(500).json({ error: 'Error updating the database' });
    }

    return res.json({ square_root: squareRoot });
  });
});

// Handle all other routes with a "Method Not Allowed" response
app.all('*', (req, res) => {
  return res.status(405).json({ error: 'Method not allowed' });
});

// Start the Express.js server
const port = dbPort || 3306;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
