// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const bookedRes = await fetch("http://localhost:5000/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookedData = await bookedRes.json();

      const createdRes = await fetch("http://localhost:5000/api/events/myevents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdData = await createdRes.json();

      setBookedEvents(bookedData || []);
      setCreatedEvents(createdData.events || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [token]);

  // إلغاء حجز
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookedEvents(bookedEvents.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error(err);
    }
  };

  // حذف إيفينت
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedEvents(createdEvents.filter(e => e.id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  // تعديل إيفينت (هنا فقط رابط لصفحة التعديل)
  const handleEditEvent = (eventId) => {
    window.location.href = `/edit-event/${eventId}`;
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>

      <section>
        <h3>Booked Events</h3>
        {bookedEvents.length === 0 ? (
          <p>You have no booked events.</p>
        ) : (
          bookedEvents.map(event => (
            <div key={event.id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
              <h4>{event.title}</h4>
              <p>{new Date(event.date).toLocaleString()}</p>
              <button
                style={{ background: "red", color: "white", padding: "5px 10px", cursor: "pointer" }}
                onClick={() => handleCancelBooking(event.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h3>Created Events</h3>
        {createdEvents.length === 0 ? (
          <p>You have not created any events.</p>
        ) : (
          createdEvents.map(event => (
            <div key={event.id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
              <h4>{event.title}</h4>
              <p>{new Date(event.date).toLocaleString()}</p>
              <button
                style={{ background: "orange", color: "white", padding: "5px 10px", marginRight: "5px" }}
                onClick={() => handleEditEvent(event.id)}
              >
                Edit
              </button>
              <button
                style={{ background: "red", color: "white", padding: "5px 10px" }}
                onClick={() => handleDeleteEvent(event.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
