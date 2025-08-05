-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user' -- 'user' or 'organizer'
);

-- events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150),
  description TEXT,
  category VARCHAR(50),
  date DATE,
  location VARCHAR(150),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- bookings
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  event_id INT REFERENCES events(id),
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
