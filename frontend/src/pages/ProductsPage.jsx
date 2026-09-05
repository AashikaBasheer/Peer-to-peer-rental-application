import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts } from "../services/api";
import "./ProductsPage.css";

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Electronics",
    "Tools & Equipment",
    "Furniture & Home",
    "Outdoor & Events"
  ];


  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const data = await getProducts();

        setProducts(data);

      } catch (error) {

        console.error("Error fetching products:", error);

        setError(
          "Unable to load products. Please try again later."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });


  return (
    <div className="products-page">

      {/*Navbar*/}

      <Navbar />


      {/* Page Header */}

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


      {/*Search Section */}

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


        {/*Category Filter*/}

        <div className="category-filter">

          {categories.map((category) => (

            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

      </section>


      {/*Products Section*/}

      <section className="products-section">

        <div className="products-section-header">

          <h2>
            Available Products
          </h2>

          <span>
            {filteredProducts.length} products
          </span>

        </div>


        {/*Loading*/}

        {loading && (

          <div className="products-message">

            <p>
              Loading products...
            </p>

          </div>

        )}


        {/*Error*/}

        {!loading && error && (

          <div className="products-message error">

            <p>
              {error}
            </p>

          </div>

        )}


        {/*Product Grid*/}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="products-grid">

              {filteredProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-image">

                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/300x220?text=ShareSpare"
                      }
                      alt={product.name}
                    />

                  </div>


                  <div className="product-content">

                    <span className="product-category">

                      {product.category}

                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-description">

                      {product.description}

                    </p>


                    <div className="product-bottom">

                      <div className="product-price">

                        <strong>
                          ₹{product.rentAmount}
                        </strong>

                        <span>
                          / hour
                        </span>

                      </div>


                      <Link
                        to={`/products/${product.id}`}
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


        {/* No Products */}

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


      {/*Footer*/}

      <Footer />

    </div>
  );
}

export default ProductsPage;