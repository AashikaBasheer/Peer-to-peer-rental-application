import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  return (
    <nav className="navbar">

      {/* Logo */}

      <Link
        to="/"
        className="navbar-logo">
        ShareSpare
      </Link>


      {/* Navigation Links */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Explore
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link
          to="/register"
          className="navbar-signup"
        >
          Sign Up
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;