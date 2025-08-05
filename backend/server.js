require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const pool = require('./config/db');

// Test DB connection
pool.connect()
  .then(() => {
    console.log(' Connected to PostgreSQL');

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));
    app.use('/api/bookings', require('./routes/bookings'));
    app.use('/api/profile', require('./routes/profile'));

    // 404
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(' Failed to connect to PostgreSQL:', err.message);
  });
