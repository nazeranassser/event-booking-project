import React, { useState } from "react";

export default function EventCard({ event }) {
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  const handleBooking = () => {
    const token = localStorage.getItem("token"); // جلب التوكن من التخزين
    if (!token) {
      setBookingStatus("You must be logged in to book.");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/api/bookings/${event.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          setBookingStatus("Booked successfully!");
        } else {
          const errData = await res.json();
          setBookingStatus(errData.message || "Booking failed");
        }
      })
      .catch(() => {
        setLoading(false);
        setBookingStatus("Booking failed due to network error");
      });
  };

  return (
    <article className="card">
      <div className="card-img">
        <img src={event.image_url || "/assets/placeholder.jpg"} alt={event.title} />
      </div>
      <div className="card-body">
        <h3>{event.title}</h3>
        <p className="date">{formatDate(event.date)}</p>
        <p className="desc">
          {event.description
            ? event.description.slice(0, 120) + (event.description.length > 120 ? "..." : "")
            : ""}
        </p>
        <p className="price">Price: {event.price ? `$${event.price}` : "Free"}</p>
        {typeof event.booking_count === "number" && (
          <p className="book-count">Booked: {event.booking_count}</p>
        )}

        <button
          onClick={handleBooking}
          disabled={loading}
          style={{
            backgroundColor: "#D2691E",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
        {bookingStatus && <p style={{ marginTop: "10px" }}>{bookingStatus}</p>}
      </div>
    </article>
  );
}
