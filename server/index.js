const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // Allow all connections for dev
  methods: ["GET", "POST"]
}));

// Connect to DB
connectDB();

// Routes
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => res.send('🟢 Aethel-Nexus Brain is Active'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/chat`);
});