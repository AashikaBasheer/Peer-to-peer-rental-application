import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PaymentPage.css";

function PaymentPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("UPI");
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

      /*
        Payment API will be connected here
        after the Spring Boot backend
        payment endpoint is ready.
      */

      console.log("Payment Details:", {

        productId: rental.productId,
        rentalHours: rentalHours,
        paymentMethod: paymentMethod,
        amount: totalAmount

      });

      setTimeout(() => {

        setLoading(false);

        navigate("/my-rentals", {

          state: {
            paymentSuccess: true,
            productName: rental.productName,
            amount: totalAmount
          }

        });

      }, 1500);

    } catch (error) {

      console.error(
        "Payment error:",
        error
      );

      setError(
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


            {/* Product */}

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


            {/* Rental Information */}

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


            {/* Price Breakdown */}

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

            <h2>
              Payment Method
            </h2>

            <p className="payment-description">
              Choose your preferred payment method.
            </p>


            <form
              onSubmit={handlePayment}
              className="payment-form"
            >

              <label
                className={
                  paymentMethod === "UPI"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    UPI
                  </strong>

                  <span>
                    Google Pay, PhonePe, Paytm and more
                  </span>

                </div>

              </label>

              <label
                className={
                  paymentMethod === "CARD"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={
                    paymentMethod === "CARD"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <span>
                    Visa, Mastercard and other cards
                  </span>

                </div>

              </label>


              <label
                className={
                  paymentMethod === "NET_BANKING"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="NET_BANKING"
                  checked={
                    paymentMethod === "NET_BANKING"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Net Banking
                  </strong>

                  <span>
                    Pay using your bank account
                  </span>

                </div>

              </label>


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

                🔒 Your payment information is
                securely processed.

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


      {/*Footer*/}

      <Footer />

    </div>

  );
}

export default PaymentPage;