import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="ShareSpare" />
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Explore</Link>

        {user ? (
          <>
            <Link to="/my-rentals">My Rentals</Link>
            <Link to="/my-listings">My Listings</Link>
            <Link to="/rental-requests">Requests</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "14px",
                color: "var(--color-dark)",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="navbar-signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;