// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [mostBooked, setMostBooked] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingMost, setLoadingMost] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) fetch latest events (we'll fetch all then sort by date client-side)
    const fetchLatest = async () => {
      try {
        const res = await api.get("/events"); // endpoint: GET /api/events
        const events = Array.isArray(res.data) ? res.data : [];
        // sort by date descending (newest first)
        const sortedByDate = events.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatest(sortedByDate.slice(0, 6)); // عرض أحدث 6 أحداث
      } catch (err) {
        console.error(err);
        setError("Failed to load latest events");
      } finally {
        setLoadingLatest(false);
      }
    };

    // 2) fetch most booked events
    const fetchMostBooked = async () => {
      try {
        // محاولة أولى: endpoint مخصص من السيرفر (مفضل للأداء)
        const res = await api.get("/events/most-booked"); // يفضل السيرفر يعمل هذا الendpoint
        if (Array.isArray(res.data)) {
          setMostBooked(res.data.slice(0, 6));
          return;
        }
      } catch (err) {
        // ممكن ما يكون موجود؛ رح نجرب fallback
        console.warn("most-booked endpoint not available, falling back");
      }

      // fallback: جلب كل الأحداث وترتيبها حسب booking_count (لو موجود)
      try {
        const res2 = await api.get("/events");
        const events = Array.isArray(res2.data) ? res2.data : [];
        // إذا backend يرسل booking_count نستطيع الترتيب هنا:
        const withCounts = events.filter(e => typeof e.booking_count === "number");
        if (withCounts.length > 0) {
          const sortedByCount = withCounts.sort((a, b) => b.booking_count - a.booking_count);
          setMostBooked(sortedByCount.slice(0, 6));
        } else {
          // لا توجد معلومات حجز في البيانات -> لا نعرض قسم الأكثر حجزاً ونطلب إضافة الـ API
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
            {latest.map(ev => <EventCard key={ev.id} event={ev} />)}
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
            {mostBooked.map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        ) : (
          <p>
            No data to show. (Make sure backend provides booking counts or
            a `/events/most-booked` endpoint.)
          </p>
        )}
      </section>
    </div>
  );
}

