import React, { useEffect, useState } from "react";
import api from "../services/api"; // axios instance
import EventCard from "../components/EventCard";

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [mostBooked, setMostBooked] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingMost, setLoadingMost] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
       const res = await api.get("/events", { withCredentials: false });

        const events = Array.isArray(res.data.events) ? res.data.events : [];
        const sortedByDate = events.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatest(sortedByDate.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Failed to load latest events");
      } finally {
        setLoadingLatest(false);
      }
    };

    const fetchMostBooked = async () => {
      try {
        const res = await api.get("/events/most-booked", { withCredentials: false });

        if (Array.isArray(res.data)) {
          const withBookingCount = res.data.map(ev => ({
            ...ev,
            booking_count: Number(ev.booking_count) || 0,
          }));
          setMostBooked(withBookingCount);
        } else {
          setMostBooked([]);
        }
      } catch (err) {
        console.error(err);
        setMostBooked([]);
      } finally {
        setLoadingMost(false);
      }
    };

    fetchLatest();
    fetchMostBooked();
  }, []);

  return (
    <div className="home-page">
      <section className="section latest-section">
        <h2>Latest Events</h2>
        {loadingLatest ? (
          <p>Loading latest events...</p>
        ) : error ? (
          <p>{error}</p>
        ) : latest.length > 0 ? (
          <div className="event-grid">
            {latest.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </section>

      <section className="section most-booked-section">
        <h2>Most Booked</h2>
        {loadingMost ? (
          <p>Loading most booked events...</p>
        ) : mostBooked.length > 0 ? (
          <div className="event-grid">
            {mostBooked.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <p>No data to show for most booked events.</p>
        )}
      </section>
    </div>
  );
}
