import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const Navigate=useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

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

      const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
      await axios.post(`${API_URL}/api/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product saved successfully!");

      setFormData({
        title: "",
        price: "",
        category: "",
        image:""
      });

      setImage(null);
      setPreview(null);
      Navigate("/admin/products");

    } catch (error) {

      alert("❌ Error saving product");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <h3 className="mb-4 fw-bold">🛒 Add New Product</h3>

      <div className="card shadow border-0">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* LEFT SIDE FORM */}

              <div className="col-md-6">

                <label className="form-label">Product Name</label>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter product name"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <label className="form-label">Price</label>

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter product price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <label className="form-label">Category</label>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter category"
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
                  required
                />

                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={loading}
                >

                  {loading ? "Saving Product..." : "Save Product"}

                </button>

              </div>


              {/* RIGHT SIDE IMAGE PREVIEW */}

              <div className="col-md-6 text-center">

                <label className="form-label">Product Preview</label>

                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "20px",
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

                    <p>No Image Selected</p>

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

export default AddProduct;
