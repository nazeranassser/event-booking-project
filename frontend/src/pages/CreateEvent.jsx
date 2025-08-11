import React, { useState } from "react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    total_seats: "",
    ticket_price: "",
    image_url: "",
  });
  const token = localStorage.getItem("token");

  const categories = [
    "Conferences & Networking",
    "Arts & Music",
    "Sports & Health",
    "Family & Kids",
    "Lifestyle & Shopping",
    "Education & Learning",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Event created successfully!");
        setFormData({
          title: "",
          description: "",
          category: "",
          date: "",
          location: "",
          total_seats: "",
          ticket_price: "",
          image_url: "",
        });
      } else {
        alert(result.message || "Error creating event");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Total Seats:</label>
        <input
          type="number"
          name="total_seats"
          value={formData.total_seats}
          onChange={handleChange}
          required
          min="1"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Ticket Price ($):</label>
        <input
          type="number"
          step="0.01"
          name="ticket_price"
          value={formData.ticket_price}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Enter image URL"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            background: "green",
            color: "white",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
