// src/pages/TypesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TypesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // يظهر { events: [...] }
        if (data.events && Array.isArray(data.events)) {
          const uniqueCategories = [
            ...new Set(data.events.map((event) => event.category))
          ];
          setCategories(uniqueCategories);
        } else {
          console.error("Unexpected API response:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Categories</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "15px"
        }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => navigate(`/types/${category}`)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#f8f8f8",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#eaeaea")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8f8f8")
            }
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}
