const pool = require('../config/db');

// إنشاء فعالية جديدة
exports.createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    if (role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Only organizers can create events.' });
    }

    const result = await pool.query(
      'INSERT INTO events (title, description, date, location, category, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, date, location, category, userId]
    );

    res.status(201).json({ event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// عرض جميع الفعاليات
exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json({ events: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// عرض فعالية محددة
exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// تحديث فعالية
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const { title, description, date, category, location } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    if (role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (event.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.rows[0].created_by !== userId) {
      return res.status(403).json({ message: 'You can only update your own events' });
    }

    const result = await pool.query(
      'UPDATE events SET title=$1, description=$2, date=$3, category=$4, location=$5 WHERE id=$6 RETURNING *',
      [title, description, date, category, location, eventId]
    );

    res.json({ event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// حذف فعالية
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    if (role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (event.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.rows[0].created_by !== userId) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
