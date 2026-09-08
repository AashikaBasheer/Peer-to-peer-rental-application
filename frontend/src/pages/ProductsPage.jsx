import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getItemImages, getProducts, getUserById } from "../services/api";
import { supabase } from "../lib/supabase";
import "./ProductsPage.css";

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [userCity, setUserCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { label: "All", id: null },
    { label: "Electronics", id: 1 },
    { label: "Tools & Equipment", id: 2 },
    { label: "Furniture & Home", id: 3 },
    { label: "Outdoor & Events", id: 4 }
  ];

  const cities = [
    "All",
    "Chennai",
    "Madurai",
    "Pondicherry",
    "Coimbatore",
    "Trichy",
    "Salem"
  ];

  useEffect(() => {

    const checkUserLocation = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        let city = user?.user_metadata?.location || localStorage.getItem("user_city");
        if (!city && user?.id) {
          try {
            const profile = await getUserById(user.id);
            if (profile?.location) {
              city = profile.location;
            }
          } catch {
            // ignore
          }
        }
        if (city) {
          setUserCity(city);
          setSelectedCity(city);
        }
      } catch (err) {
        console.warn("Could not determine user location:", err);
      }
    };

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const data = await getProducts();
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            let images = [];
            try {
              images = await getItemImages(product.itemId);
            } catch (imageError) {
              console.warn(`Unable to load images for item ${product.itemId}:`, imageError);
            }
            const primaryImage =
              images.find((image) => image.isPrimary) || images[0];

            return {
              ...product,
              imageUrl: primaryImage?.imageUrl || "",
            };
          })
        );

        setProducts(productsWithImages);

      } catch (error) {

        console.error("Error fetching products:", error);

        setError(
          "Unable to load products. Please try again later."
        );

      } finally {

        setLoading(false);

      }

    };

    checkUserLocation();
    fetchProducts();

  }, []);

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.itemName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      product.catID === selectedCategory;

    const matchesCity =
      !selectedCity ||
      selectedCity === "All" ||
      product.location?.trim().toLowerCase() === selectedCity.trim().toLowerCase();

    // Only show available products with stock > 0
    const isAvailable =
      product.availability !== false &&
      (product.quantity === undefined || product.quantity === null || Number(product.quantity) > 0);

    return matchesSearch && matchesCategory && matchesCity && isAvailable;

  });


  return (
    <div className="products-page">

      <Navbar />


      <section className="products-header">

        <div className="products-header-content">

          <h1>
            Explore Products
          </h1>

          <p>
            Find the products you need and rent them
            from people around you.
          </p>

        </div>

      </section>


      <section className="products-search-section">

        <div className="search-container">

          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>


        <div className="city-filter-bar">
          <div className="city-filter-control">
            <span className="city-filter-label">City:</span>
            <select
              className="city-filter-select"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "All" ? "All Cities" : city}
                </option>
              ))}
            </select>
          </div>

          {userCity && selectedCity === userCity && (
            <span className="user-city-notice">
              Filtered to your registered city: <strong>{userCity}</strong>
            </span>
          )}

          {selectedCity !== "All" && (
            <button
              className="show-all-cities-btn"
              onClick={() => setSelectedCity("All")}
            >
              Show all locations
            </button>
          )}
        </div>

        <div className="category-filter">

          {categories.map((category) => (

            <button
              key={category.label}
              className={
                selectedCategory === category.id
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() =>
                setSelectedCategory(category.id)
              }
            >
              {category.label}
            </button>

          ))}

        </div>

      </section>


      <section className="products-section">

        <div className="products-section-header">

          <h2>
            Available Products
          </h2>

          <span>
            {filteredProducts.length} products
          </span>

        </div>


        {loading && (

          <div className="products-message">

            <p>
              Loading products...
            </p>

          </div>

        )}


        {!loading && error && (

          <div className="products-message error">

            <p>
              {error}
            </p>

          </div>

        )}


        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="products-grid">

              {filteredProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.itemId}
                >

                  <div className="product-image">

                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/300x220?text=ShareSpare"
                      }
                      alt={product.itemName}
                    />

                  </div>


                  <div className="product-content">

                    <div className="product-card-meta">
                      <span className="product-category">
                        {product.category || "Available item"}
                      </span>
                      {product.location && (
                        <span className="product-location-tag">
                          {product.location}
                        </span>
                      )}
                    </div>

                    <h3>
                      {product.itemName}
                    </h3>

                    <p className="product-description">
                      {product.description || "No description available."}
                    </p>

                    <div className="product-stock-row">
                      <span className="stock-indicator">
                        Available: <strong>{product.quantity !== undefined && product.quantity !== null ? product.quantity : 1} units</strong>
                      </span>
                    </div>

                    <div className="product-bottom">

                      <div className="product-price">

                        <strong>
                          ₹{product.rentalPrice}
                        </strong>

                        <span>
                          / hour
                        </span>

                      </div>


                      <Link
                        to={`/products/${product.itemId}`}
                        className="view-button"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}


        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="products-message">

              <h3>
                No products found
              </h3>

              <p>
                Try searching for another product
                or selecting a different category.
              </p>

            </div>

          )}

      </section>


      <Footer />

    </div>
  );
}

export default ProductsPage;