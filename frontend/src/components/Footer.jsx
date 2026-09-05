import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {

  return (
    <footer className="footer">

      {/* Footer Main Content */}

      <div className="footer-content">


        {/* Brand */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            ShareSpare
          </Link>

          <p>
            Rent what you need.
            <br />
            Lend what you don't.
          </p>

        </div>


        {/* Quick Links */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Explore Products
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Sign Up
          </Link>

        </div>


        {/* Categories */}

        <div className="footer-column">

          <h3>
            Categories
          </h3>

          <Link to="/products">
            Electronics
          </Link>

          <Link to="/products">
            Tools & Equipment
          </Link>

          <Link to="/products">
            Furniture & Home
          </Link>

          <Link to="/products">
            Outdoor & Events
          </Link>

        </div>


        {/* About */}

        <div className="footer-column">

          <h3>
            ShareSpare
          </h3>

          <Link to="/">
            About Us
          </Link>

          <Link to="/">
            How It Works
          </Link>

          <Link to="/">
            Contact Us
          </Link>

        </div>

      </div>


      {/* Footer Bottom */}

      <div className="footer-bottom">

        <p>
          © 2026 ShareSpare. All rights reserved.
        </p>

        <div>

          <Link to="/">
            Privacy Policy
          </Link>

          <Link to="/">
            Terms & Conditions
          </Link>

        </div>

      </div>

    </footer>
  );
}

export default Footer;