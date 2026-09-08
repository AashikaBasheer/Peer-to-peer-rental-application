import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getItemImages, getProducts } from "../services/api";
import "./ProductsPage.css";

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { label: "All", id: null },
    { label: "Electronics", id: 1 },
    { label: "Tools & Equipment", id: 2 },
    { label: "Furniture & Home", id: 3 },
    { label: "Outdoor & Events", id: 4 }
  ];


  useEffect(() => {

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

    return matchesSearch && matchesCategory;

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

                    <span className="product-category">

                      {product.category || "Available item"}

                    </span>

                    <h3>
                      {product.itemName}
                    </h3>

                    <p className="product-description">

                      {product.description || "No description available."}

                    </p>


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