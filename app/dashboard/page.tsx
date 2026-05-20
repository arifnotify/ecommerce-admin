'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  const token = Cookies.get('token');

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <h2>Total Products: {products.length}</h2>
    </div>
  );
}