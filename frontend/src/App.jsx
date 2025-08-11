// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import TypesPage from "./pages/TypesPage";
import CategoryEventsPage from "./pages/CategoryEventsPage";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/types" element={<TypesPage />} />
          <Route path="/types/:category" element={<CategoryEventsPage />} />
          <Route path="/create" element={<CreateEvent />} />
          
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
