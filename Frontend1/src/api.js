import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // Backend URL from .env file
  withCredentials: true, // only if you're using cookies/session-based auth
});

export default API;
