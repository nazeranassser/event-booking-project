const db = require("../config/db"); // Database connection

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from verifyToken
    const { eventId } = req.params;

    // Check if the event exists
    const event = await db.query("SELECT * FROM events WHERE id = $1", [eventId]);
    if (event.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if booking already exists
    const existing = await db.query(
      "SELECT * FROM bookings WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You have already booked this event" });
    }

    // Create booking
    await db.query(
      "INSERT INTO bookings (user_id, event_id) VALUES ($1, $2)",
      [userId, eventId]
    );

    res.json({ message: "Booking created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    // Check if booking exists and belongs to the user
    const booking = await db.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [bookingId, userId]
    );
    if (booking.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Delete booking
    await db.query("DELETE FROM bookings WHERE id = $1", [bookingId]);

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await db.query(
      `SELECT b.id, e.title, e.date, b.booked_at
       FROM bookings b
       JOIN events e ON b.event_id = e.id
       WHERE b.user_id = $1`,
      [userId]
    );

    res.json(bookings.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



