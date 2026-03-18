import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

adminApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default adminApi;
