import { useState, useEffect } from "react";
import api from "../../assets/services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const res = await api.post("/categories", { name: newCategory });
        setCategories([...categories, res.data]);
        setNewCategory("");
      } catch (err) {
        console.error("Error adding category:", err);
        alert(err.response?.data?.message || "Error adding category");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  if (loading) return <div className="p-4">Loading categories...</div>;

  return (
    <>
      <h3 className="mb-4 fw-bold">📂 Category Management</h3>

      {/* Add Category Card */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-3">Add New Category</h5>
          <div className="row g-2">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success w-100"
                onClick={handleAddCategory}
              >
                ➕ Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card shadow border-0">
        <div className="card-body">
          <h5 className="mb-3">All Categories</h5>
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">
                      {category.name}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Categories;
