import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce-backend-njlc.onrender.com',
});

export default api;

