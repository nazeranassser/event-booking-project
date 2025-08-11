// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={{
      marginTop: "40px",
      padding: "15px 20px",
      backgroundColor: "#f1f1f1",
      textAlign: "center",
      color: "#555",
      fontSize: "14px"
    }}>
      &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
    </footer>
  );
}
