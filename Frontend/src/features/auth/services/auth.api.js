import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});

export async function register(data) {
  const response = await api.post("/register", data);
  return response.data;
}

export async function login(data) {
  const response = await api.post("/login", data);
  return response.data;
}

export async function logout() {
  const response = await api.get("/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/get-me");
  return response.data;
}
