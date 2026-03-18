import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./product.css";

const ProductsPage = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Page Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold">Products</h3>

        <Link
          to="/admin/add-product"
          className="btn btn-dark px-4 shadow"
        >
          + Add Product
        </Link>

      </div>


      {/* Product Table */}

      <div className="card shadow-lg border-0">

        <div className="card-body">

          <table className="table align-middle table-hover">

            <thead
              style={{
                background: "linear-gradient(90deg,#141e30,#243b55)",
                color: "white"
              }}
            >

              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.map((product, index) => (

                <tr key={product._id}>

                  <td>{index + 1}</td>

                  <td>

                    <img
                     src={product.image || product.thumbnail}
                      alt={product.title}
                      width="55"
                      height="55"
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />

                  </td>

                  <td className="fw-semibold">

                    {product.title}

                  </td>

                  <td
                    style={{
                      color: "#198754",
                      fontWeight: "600"
                    }}
                  >

                    ₹ {product.price}

                  </td>

                  <td>

                    <span className="badge btn1 bg-success px-3 py-2">
                      Active
                    </span>

                  </td>

                  <td>

                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="btn btn-sm btn-warning me-2 shadow-sm"
                    >
                      ✏ Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn2 btn-sm btn-danger shadow-sm"
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

export default ProductsPage;
