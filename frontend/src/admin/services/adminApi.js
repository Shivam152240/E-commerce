import axios from "axios";

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
});

adminApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default adminApi;
