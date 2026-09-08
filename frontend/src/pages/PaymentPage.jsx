import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createPayment } from "../services/api";
import "./PaymentPage.css";

function PaymentPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const rental = location.state || {

    productId: "",
    productName: "Rental Product",
    productImage: "",
    category: "Category",
    rentAmount: 0,
    rentalHours: 1,
    lenderName: "ShareSpare User"

  };

  const rentAmount =
    Number(rental.rentAmount || 0);

  const rentalHours =
    Number(rental.rentalHours || 1);

  const subtotal =
    rentAmount * rentalHours;

  const serviceFee =
    Math.round(subtotal * 0.05);

  const totalAmount =
    subtotal + serviceFee;

  const handlePayment = async (event) => {

    event.preventDefault();

    try {

      setLoading(true);
      setError("");

      if (!rental.bookingId) {
        throw new Error("Payment is available after lender approval.");
      }

      await createPayment({
          bookingId: rental.bookingId,
        amount: totalAmount,
        paymentType: "RENTAL",
        paymentMethod: "DIRECT",
        paymentStatus: "COMPLETED",
      });

      navigate("/", {
        state: {
          paymentSuccess: true,
          productName: rental.productName,
          amount: totalAmount,
        },
      });

    } catch (error) {

      console.error(
        "Payment error:",
        error
      );

      const responseData = error.response?.data;
      setError(
        responseData?.detail ||
        responseData?.message ||
        (typeof responseData === "string" ? responseData : null) ||
        error.message ||
        "Payment failed. Please try again."
      );

      setLoading(false);

    }

  };


  return (

    <div className="payment-page">

      <Navbar />

      <div className="payment-breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>
          /
        </span>

        <Link to="/products">
          Products
        </Link>

        <span>
          /
        </span>

        <span>
          Payment
        </span>

      </div>

      <section className="payment-header">

        <h1>
          Complete Your Payment
        </h1>

        <p>
          Review your rental details and complete
          the payment securely.
        </p>

      </section>


      <main className="payment-container">

        <div className="payment-layout">

          <section className="rental-summary">

            <h2>
              Rental Summary
            </h2>


            <div className="payment-product">

              <div className="payment-product-image">

                {rental.productImage ? (

                  <img
                    src={rental.productImage}
                    alt={rental.productName}
                  />

                ) : (

                  <div className="image-placeholder">
                    ShareSpare
                  </div>

                )}

              </div>


              <div className="payment-product-info">

                <span>
                  {rental.category}
                </span>

                <h3>
                  {rental.productName}
                </h3>

                <p>
                  Owner: {rental.lenderName}
                </p>

              </div>

            </div>


            <div className="rental-information">

              <div className="information-row">

                <span>
                  Rental Duration
                </span>

                <strong>
                  {rentalHours} hour
                  {rentalHours > 1 ? "s" : ""}
                </strong>

              </div>


              <div className="information-row">

                <span>
                  Rent per Hour
                </span>

                <strong>
                  ₹{rentAmount}
                </strong>

              </div>

            </div>


            <div className="price-breakdown">

              <h3>
                Price Details
              </h3>

              <div className="price-row">

                <span>
                  Rental Amount
                </span>

                <span>
                  ₹{subtotal}
                </span>

              </div>


              <div className="price-row">

                <span>
                  Service Fee
                </span>

                <span>
                  ₹{serviceFee}
                </span>

              </div>


              <div className="price-row total-row">

                <strong>
                  Total Amount
                </strong>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

            </div>

          </section>

          <section className="payment-section">

            <h2>Confirm Payment</h2>

            <p className="payment-description">
              Click the button below to mark this rental as paid.
            </p>


            <form
              onSubmit={handlePayment}
              className="payment-form"
            >

              {error && (

                <p className="payment-error">
                  {error}
                </p>

              )}

              <button
                type="submit"
                className="pay-button"
                disabled={loading}
              >

                {loading
                  ? "Processing Payment..."
                  : `Pay ₹${totalAmount}`}

              </button>

              <p className="secure-payment">
                This is a demo payment. No payment details are collected.

              </p>

            </form>


            <Link
              to="/products"
              className="back-products"
            >
              ← Back to Products
            </Link>

          </section>

        </div>

      </main>


      <Footer />

    </div>

  );
}

export default PaymentPage;