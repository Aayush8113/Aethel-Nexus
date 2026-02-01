const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // <-- Import the file we just made

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB(); // <-- Execute the connection

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Nexus AI API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));