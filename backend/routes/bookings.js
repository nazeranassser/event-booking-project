const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
  res.send('Bookings route working ✅');
});

module.exports = router;
