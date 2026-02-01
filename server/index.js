const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes'); 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Nexus AI API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));