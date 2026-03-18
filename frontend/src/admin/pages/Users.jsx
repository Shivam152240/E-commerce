import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";
import "./user.css";

const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  const handleBlock = async (userId) => {
    if (window.confirm("Are you sure you want to change this user's status?")) {
      try {
        await adminApi.put(`/users/${userId}/block`);
        fetchUsers(); // Refresh list
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update user status");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading Users...</div>;

  return (
    <>
      <h3 className="mb-4 fw-bold">👥 User Management</h3>

      <div className="card shadow border-0">

        <div className="card-body">

          <h5 className="mb-3">All Users</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              background: user.isAdmin ? "#dc3545" : "#6b7784",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "10px",
                              fontWeight: "bold"
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          {user.username}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.isAdmin ? (
                          <span className="badge bg-danger">Admin</span>
                        ) : (
                          <span className="badge bg-success">User</span>
                        )}
                      </td>
                      <td>
                        {user.isBlocked ? (
                          <span className="badge bg-secondary">Blocked</span>
                        ) : (
                          <span className="badge bg-info text-dark">Active</span>
                        )}
                      </td>
                      <td>
                        {!user.isAdmin && (
                          <button 
                            className={`btn btn-sm px-3 ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                            style={{ minWidth: "80px" }}
                            onClick={() => handleBlock(user._id)}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </>
  );
};

export default Users;
