'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function ProductsPage() {
  const token = Cookies.get('token');

  const [products, setProducts] = useState([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    await api.post(
      '/products',
      {
        name,
        price: Number(price),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={addProduct}>Add</button>

      <hr />

      {products.map((p: any) => (
        <div key={p._id}>
          {p.name} - {p.price}
        </div>
      ))}
    </div>
  );
}
