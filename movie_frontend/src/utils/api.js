const API_BASE_URL = "http://localhost:3000/api";

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export default apiConfig;
