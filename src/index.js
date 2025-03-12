import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import connectDB from './db/conn.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Sample API to get user location (Needs frontend fetch request)
app.get('/api/location', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.json({ ip, message: 'Location API is working!' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
