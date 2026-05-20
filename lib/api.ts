import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce-backend-njlc.onrender.com',
});

export default api;

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategory = async (data: any, token: string) => {
  const res = await api.post('/categories', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
