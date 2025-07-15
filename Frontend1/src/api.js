import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // Backend URL from .env file 
});

export default API;
