'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();

  // Token
  const token = Cookies.get('token');

  // States
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');

      setCategories(res.data);
    } catch (error) {
      console.log(error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Load Categories
  useEffect(() => {
    // যদি token না থাকে login page এ পাঠাবে
    if (!token) {
      router.push('/');
      return;
    }

    fetchCategories();
  }, []);

  // Add Category
  const addCategory = async () => {
    if (!name) {
      alert('Please enter category name');
      return;
    }

    try {
      setAdding(true);

      await api.post(
        '/categories',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Clear Input
      setName('');

      // Reload Categories
      await fetchCategories();

      alert('Category Added Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          'Failed to add category'
      );
    } finally {
      setAdding(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f4f7fb',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#2563eb',
        }}
      >
        Loading Categories...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f7fb',
        padding: '30px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          marginBottom: '25px',
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#111827',
            fontSize: '30px',
          }}
        >
          Categories Management
        </h1>

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
          }}
        >
          Create and manage product categories
        </p>
      </div>

      {/* Add Category Card */}
      <div
        style={{
          background: '#ffffff',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          marginBottom: '30px',
          maxWidth: '500px',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '20px',
            color: '#111827',
          }}
        >
          Add New Category
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            boxSizing: 'border-box',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        />

        {/* Button */}
        <button
          onClick={addCategory}
          disabled={adding}
          style={{
            width: '100%',
            padding: '13px',
            border: 'none',
            borderRadius: '10px',
            background: adding ? '#93c5fd' : '#2563eb',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: adding ? 'not-allowed' : 'pointer',
          }}
        >
          {adding ? 'Adding Category...' : 'Add Category'}
        </button>
      </div>

      {/* Categories List */}
      <div>
        <h2
          style={{
            marginBottom: '20px',
            color: '#111827',
          }}
        >
          Categories List
        </h2>

        {categories.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '12px',
              color: '#6b7280',
            }}
          >
            No categories found
          </div>
        ) : (
          categories.map((c: any) => (
            <div
              key={c._id}
              style={{
                background: '#ffffff',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#111827',
                }}
              >
                {c.name}
              </h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}