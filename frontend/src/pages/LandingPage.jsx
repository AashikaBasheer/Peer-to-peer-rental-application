import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-kicker">Borrow locally. Share easily.</p>
          <h1>Useful things, close to home.</h1>
          <p className="hero-description">
            ShareSpare helps people rent the things they only need for a
            little while, from someone nearby.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="primary-button">
              Browse items
            </Link>
            <Link to="/login" className="secondary-button">
              List an item
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <h2>Start with a category</h2>
          <p>See what people nearby are sharing.</p>
        </div>

        <div className="category-grid">
          <Link to="/products" className="category-card">
            <h3>Electronics</h3>
            <p>Cameras, speakers, projectors and more.</p>
            <span>View items</span>
          </Link>
          <Link to="/products" className="category-card">
            <h3>Tools</h3>
            <p>Borrow the tools you need for a job.</p>
            <span>View items</span>
          </Link>
          <Link to="/products" className="category-card">
            <h3>Home</h3>
            <p>Furniture, appliances and everyday things.</p>
            <span>View items</span>
          </Link>
          <Link to="/products" className="category-card">
            <h3>Outdoor</h3>
            <p>Equipment for weekends and small events.</p>
            <span>View items</span>
          </Link>
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <h2>How it works</h2>
          <p>
            Find an item, agree on the details, and return it when you are
            done.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Choose</h3>
            <p>Browse items and find one that suits your plans.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <h3>Request</h3>
            <p>Send a request to the person who listed it.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <h3>Use</h3>
            <p>Arrange pickup, use the item, and return it on time.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;