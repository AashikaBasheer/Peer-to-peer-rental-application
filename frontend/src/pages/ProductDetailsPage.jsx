import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createBooking, getItemImages, getProductById } from "../services/api";
import { supabase } from "../lib/supabase";
import "./ProductDetailsPage.css";

function ProductDetailsPage() {

  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rentalHours, setRentalHours] = useState(1);

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getProductById(productId);
        let images = [];
        try {
          images = await getItemImages(productId);
        } catch (imageError) {
          console.warn(`Unable to load images for item ${productId}:`, imageError);
        }
        const primaryImage = images.find((image) => image.isPrimary) || images[0];

        setProduct({
          ...data,
          imageUrl: primaryImage?.imageUrl || "",
        });

      } catch (error) {

        console.error(
          "Error fetching product:",
          error
        );

        setError(
          "Unable to load product details."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [productId]);

  const handleRentalRequest = async (event) => {

  event.preventDefault();

  setRequestError("");

    try {

    setRequestLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const renterId = sessionData.session?.user?.id;

    if (!renterId) {
      throw new Error("Please log in before requesting an item.");
    }

    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + Number(rentalHours) * 60 * 60 * 1000
    );

    await createBooking({
      itemId: product.itemId,
      renterId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    navigate("/my-rentals");

  } catch (error) {

    console.error(
      "Error navigating to payment:",
      error
    );

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Unable to proceed with request. Please try again.";

    setRequestError(
      typeof message === "string" ? message : JSON.stringify(message)
    );

    setRequestLoading(false);
  }

};

  if (loading) {

    return (

      <div className="product-details-page">

        <Navbar />

        <div className="details-message">

          <p>
            Loading product details...
          </p>

        </div>

        <Footer />

      </div>

    );

  }
  if (error || !product) {

    return (

      <div className="product-details-page">

        <Navbar />

        <div className="details-message">

          <h2>
            Product Not Found
          </h2>

          <p>
            {error || "The requested product does not exist."}
          </p>

          <Link
            to="/products"
            className="back-button"
          >
            ← Back to Products
          </Link>

        </div>

        <Footer />

      </div>

    );

  }

  const rentAmount =
    Number(product.rentalPrice || 0);

  const totalAmount =
    rentAmount * Number(rentalHours);

  return (

    <div className="product-details-page">

      <Navbar />

      <main className="product-details-container">

        <div className="product-details-card">

          <div className="details-image-section">

            <img
              src={
                product.imageUrl ||
                "https://via.placeholder.com/600x500?text=ShareSpare"
              }
              alt={product.itemName}
              className="details-product-image"
            />

          </div>

          <div className="details-info-section">

            <span className="details-category">

              {product.category || "Available item"}

            </span>


            <h1>
              {product.itemName}
            </h1>


            <p className="details-description">

              {product.description ||
                "No description available for this product."}

            </p>


            <div className="price-section">

              <span>
                Rental Price
              </span>

              <div>

                <strong>
                  ₹{rentAmount}
                </strong>

                <small>
                  / hour
                </small>

              </div>

            </div>

            <div className="availability-section">

              <h3>
                Availability
              </h3>

              <p>

                {product.lendingHours ||
                  product.availableHours ||
                  "Contact lender for availability"}

              </p>

            </div>

            <div className="lender-section">

              <h3>
                Product Owner
              </h3>

              <p>

                {product.lenderName ||
                  product.ownerName ||
                  "ShareSpare User"}

              </p>

            </div>

            <form
              className="rental-form"
              onSubmit={handleRentalRequest}
            >

              <div className="form-group">

                <label>
                  Rental Duration
                </label>

                <select
                  value={rentalHours}
                  onChange={(event) =>
                    setRentalHours(
                      event.target.value
                    )
                  }
                >

                  <option value="1">
                    1 Hour
                  </option>

                  <option value="2">
                    2 Hours
                  </option>

                  <option value="3">
                    3 Hours
                  </option>

                  <option value="4">
                    4 Hours
                  </option>

                  <option value="6">
                    6 Hours
                  </option>

                  <option value="8">
                    8 Hours
                  </option>

                  <option value="12">
                    12 Hours
                  </option>

                  <option value="24">
                    24 Hours
                  </option>

                </select>

              </div>

              <div className="total-section">

                <span>
                  Estimated Total
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

              {requestError && (

                <p className="request-error">

                  {requestError}

                </p>

              )}

              <button
                type="submit"
                className="request-button"
                disabled={requestLoading}
              >

                {requestLoading
                  ? "Sending Request..."
                  : "Request to Rent"}

              </button>

            </form>


            <Link
              to="/products"
              className="back-products"
            >
              ← Back to Products
            </Link>

          </div>

        </div>

      </main>


      <Footer />

    </div>

  );
}

export default ProductDetailsPage;