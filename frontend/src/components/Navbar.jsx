// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // أيقونة البروفايل

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand">EventAt</span>
      </div>

      <div className="nav-right">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/types" className="nav-link">Types</NavLink>
        <NavLink to="/create" className="nav-link">Create Event</NavLink>
        <NavLink to="/profile" className="nav-link profile-icon">
          <FaUserCircle size={25} />
        </NavLink>
      </div>
    </nav>
  );
}
