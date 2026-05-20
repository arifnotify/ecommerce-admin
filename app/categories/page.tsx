'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function CategoriesPage() {
  const token = Cookies.get('token');

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    await api.post(
      '/categories',
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setName('');
    fetchCategories();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Categories</h1>

      <input
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addCategory}>Add</button>

      <hr />

      {categories.map((c: any) => (
        <div key={c._id}>
          {c.name}
        </div>
      ))}
    </div>
  );
}