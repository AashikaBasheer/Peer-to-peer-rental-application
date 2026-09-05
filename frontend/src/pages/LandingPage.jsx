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

          <p className="hero-tag">
            PEER-TO-PEER RENTAL PLATFORM
          </p>

          <h1>
            Rent what you need.
            <br />
            Lend what you don't.
          </h1>

          <p className="hero-description">
            ShareSpare connects people who have products they
            don't currently use with people who need them
            for a short period of time.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="primary-button"
            >
              Explore Products
            </Link>

            <Link
              to="/login"
              className="secondary-button"
            >
              List Your Product
            </Link>

          </div>

        </div>

      </section>


      <section className="categories-section">

        <div className="section-heading">

          <p className="section-tag">
            EXPLORE
          </p>

          <h2>
            Find What You Need
          </h2>

          <p>
            Browse products available for rent from
            people in your community.
          </p>

        </div>


        <div className="category-grid">

          {/* Electronics */}

          <div className="category-card">

            <div className="category-icon">
              ⚡
            </div>

            <h3>
              Electronics
            </h3>

            <p>
              Cameras, speakers, projectors,
              gaming consoles and more.
            </p>

            <Link to="/products">
              Explore →
            </Link>

          </div>


          {/* Tools */}

          <div className="category-card">

            <div className="category-icon">
              🔧
            </div>

            <h3>
              Tools & Equipment
            </h3>

            <p>
              Power tools, ladders, gardening
              equipment and more.
            </p>

            <Link to="/products">
              Explore →
            </Link>

          </div>


          {/* Furniture */}

          <div className="category-card">

            <div className="category-icon">
              🏠
            </div>

            <h3>
              Furniture & Home
            </h3>

            <p>
              Chairs, tables, appliances and
              other useful home products.
            </p>

            <Link to="/products">
              Explore →
            </Link>

          </div>


          {/* Outdoor */}

          <div className="category-card">

            <div className="category-icon">
              ⛺
            </div>

            <h3>
              Outdoor & Events
            </h3>

            <p>
              Camping, sports, party and
              event equipment.
            </p>

            <Link to="/products">
              Explore →
            </Link>

          </div>

        </div>

      </section>

      <section className="how-section">

        <div className="section-heading">

          <p className="section-tag">
            HOW IT WORKS
          </p>

          <h2>
            Simple. Local. Useful.
          </h2>

          <p>
            ShareSpare makes borrowing and lending
            products simple.
          </p>

        </div>


        <div className="steps-grid">

          <div className="step-card">

            <span>
              01
            </span>

            <h3>
              List
            </h3>

            <p>
              Upload your unused product,
              set the rental price and
              available hours.
            </p>

          </div>


          <div className="step-card">

            <span>
              02
            </span>

            <h3>
              Request
            </h3>

            <p>
              Borrowers search for products
              and send rental requests.
            </p>

          </div>


          <div className="step-card">

            <span>
              03
            </span>

            <h3>
              Rent
            </h3>

            <p>
              Accept the request and
              receive payment for your product.
            </p>

          </div>


          <div className="step-card">

            <span>
              04
            </span>

            <h3>
              Return
            </h3>

            <p>
              The borrower returns the product
              after the rental period.
            </p>

          </div>

        </div>

      </section>


      <section className="cta-section">

        <h2>
          Have something you're not using?
        </h2>

        <p>
          Turn your unused products into
          extra income with ShareSpare.
        </p>

        <Link
          to="/login"
          className="cta-button"
        >
          Start Lending
        </Link>

      </section>


      {/*Footer*/}

      <Footer />

    </div>
  );
}

export default LandingPage;