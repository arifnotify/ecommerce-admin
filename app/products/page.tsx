'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();

  // Products State
  const [products, setProducts] = useState<any[]>([]);

  // Categories State
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  // Loading State
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const token = Cookies.get('token');

      const res = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log(error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');

      setCategories(res.data);
    } catch (error) {
      console.log(error);
      alert('Failed to load categories');
    }
  };

  // Load Data
  useEffect(() => {
    const token = Cookies.get('token');

    // যদি token না থাকে login page এ পাঠাবে
    if (!token) {
      router.push('/');
      return;
    }

    fetchProducts();
    fetchCategories();
  }, []);

  // Add Product
  const addProduct = async () => {
    if (!name || !price || !category) {
      alert('Please fill all fields');
      return;
    }

    try {
      setAdding(true);

      const token = Cookies.get('token');

      await api.post(
        '/products',
        {
          name,
          price: Number(price),
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Clear Inputs
      setName('');
      setPrice('');
      setCategory('');

      // Reload Products
      await fetchProducts();

      alert('Product Added Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          'Failed to add product'
      );
    } finally {
      setAdding(false);
    }
  };

  // Loading UI
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
        Loading Products...
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
          Products Management
        </h1>

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
          }}
        >
          Add products and connect categories
        </p>
      </div>

      {/* Add Product Card */}
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
          Add New Product
        </h2>

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            boxSizing: 'border-box',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        />

        {/* Product Price */}
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            boxSizing: 'border-box',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        />

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
        >
          <option value="">Select Category</option>

          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={addProduct}
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
          {adding ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>

      {/* Product List */}
      <div>
        <h2
          style={{
            marginBottom: '20px',
            color: '#111827',
          }}
        >
          Product List
        </h2>

        {products.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '12px',
              color: '#6b7280',
            }}
          >
            No products found
          </div>
        ) : (
          products.map((p: any) => (
            <div
              key={p._id}
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
                {p.name}
              </h3>

              <p
                style={{
                  marginTop: '8px',
                  color: '#6b7280',
                }}
              >
                ৳ {p.price}
              </p>

              {/* Category Show */}
              {p.category && (
                <p
                  style={{
                    marginTop: '6px',
                    color: '#2563eb',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Category: {p.category.name}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}