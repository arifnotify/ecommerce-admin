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

  // Add Product State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  // Edit Product State
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');

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

      setName('');
      setPrice('');
      setCategory('');

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

  // Start Edit
  const startEdit = (product: any) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditCategory(product.category?._id || '');
  };

  // Update Product
  const updateProduct = async () => {
    if (!editName || !editPrice || !editCategory) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = Cookies.get('token');

      await api.patch(
        `/products/${editingId}`,
        {
          name: editName,
          price: Number(editPrice),
          category: editCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingId('');
      setEditName('');
      setEditPrice('');
      setEditCategory('');

      await fetchProducts();

      alert('Product Updated Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          'Failed to update product'
      );
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
          Add, edit and delete products
        </p>
      </div>

      {/* Add Product */}
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
            color: '#111827',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        />

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
            color: '#111827',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        />

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
            color: '#111827',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Select Category</option>

          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

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

      {/* Products Table */}
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
              <th style={{ padding: '14px', textAlign: 'left' }}>
                Name
              </th>

              <th style={{ padding: '14px', textAlign: 'left' }}>
                Price
              </th>

              <th style={{ padding: '14px', textAlign: 'left' }}>
                Category
              </th>

              <th style={{ padding: '14px', textAlign: 'left' }}>
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
                  {/* Name */}
                  <td style={{ padding: '14px' }}>
                    {editingId === p._id ? (
                      <input
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        style={{
                          padding: '8px',
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          color: '#111827',
                        }}
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '14px' }}>
                    {editingId === p._id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) =>
                          setEditPrice(e.target.value)
                        }
                        style={{
                          padding: '8px',
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          color: '#111827',
                        }}
                      />
                    ) : (
                      `৳ ${p.price}`
                    )}
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px' }}>
                    {editingId === p._id ? (
                      <select
                        value={editCategory}
                        onChange={(e) =>
                          setEditCategory(e.target.value)
                        }
                        style={{
                          padding: '8px',
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          color: '#111827',
                        }}
                      >
                        <option value="">
                          Select Category
                        </option>

                        {categories.map((c: any) => (
                          <option
                            key={c._id}
                            value={c._id}
                          >
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      p.category?.name || 'No Category'
                    )}
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      padding: '14px',
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    {editingId === p._id ? (
                      <>
                        <button
                          onClick={updateProduct}
                          style={{
                            padding: '8px 14px',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#16a34a',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Save
                        </button>

                        <button
                          onClick={() =>
                            setEditingId('')
                          }
                          style={{
                            padding: '8px 14px',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#6b7280',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          style={{
                            padding: '8px 14px',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#2563eb',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(p._id)
                          }
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
                      </>
                    )}
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