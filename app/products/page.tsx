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
  const [deletingId, setDeletingId] = useState('');

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

  // Delete Product
  const deleteProduct = async (id: string) => {
    try {
      setDeletingId(id);

      const token = Cookies.get('token');

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProducts();

      alert('Product Deleted Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          'Failed to delete product'
      );
    } finally {
      setDeletingId('');
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
          Add, manage and delete products
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

      {/* Product Table */}
      <div
        style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          overflowX: 'auto',
        }}
      >
        <h2
          style={{
            marginBottom: '20px',
            color: '#111827',
          }}
        >
          Product List
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#f3f4f6',
              }}
            >
              <th
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  color: '#111827',
                }}
              >
                Name
              </th>

              <th
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  color: '#111827',
                }}
              >
                Price
              </th>

              <th
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  color: '#111827',
                }}
              >
                Category
              </th>

              <th
                style={{
                  padding: '14px',
                  textAlign: 'left',
                  color: '#111827',
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr
                  key={p._id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td
                    style={{
                      padding: '14px',
                      color: '#111827',
                    }}
                  >
                    {p.name}
                  </td>

                  <td
                    style={{
                      padding: '14px',
                      color: '#111827',
                    }}
                  >
                    ৳ {p.price}
                  </td>

                  <td
                    style={{
                      padding: '14px',
                      color: '#2563eb',
                    }}
                  >
                    {p.category?.name || 'No Category'}
                  </td>

                  <td
                    style={{
                      padding: '14px',
                    }}
                  >
                    <button
                      onClick={() => deleteProduct(p._id)}
                      disabled={deletingId === p._id}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '8px',
                        background:
                          deletingId === p._id
                            ? '#fca5a5'
                            : '#dc2626',
                        color: '#ffffff',
                        cursor:
                          deletingId === p._id
                            ? 'not-allowed'
                            : 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {deletingId === p._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}