import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Product Load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);

        setFormData({
          title: res.data.title,
          price: res.data.price,
          category: res.data.category,
          image: res.data.image,
        });

        setPreview(res.data.image);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("category", formData.category);

    if (image) {
      data.append("image", image);
    }

    try {

      await adminApi.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product updated successfully");

      navigate("/admin/products");

    } catch (error) {

      alert("❌ Error updating product");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h3 className="mb-4 fw-bold">✏️ Edit Product</h3>

      <div className="card shadow border-0">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-6">

                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>

              </div>

              <div className="col-md-6 text-center">

                <label className="form-label">Product Preview</label>

                <div
                  style={{
                    border: "1px solid #eee",
                    padding: "20px",
                    borderRadius: "10px",
                    background: "#f8f9fa"
                  }}
                >

                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain"
                      }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}

                </div>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditProduct;
