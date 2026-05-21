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
  const [image, setImage] = useState('');

  // Upload State
  const [uploading, setUploading] = useState(false);

  // Edit Product State
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] =
    useState('');

  // Loading State
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] =
    useState('');

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

  // Upload Image
  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('file', file);

      const res = await api.post(
        '/upload',
        formData,
      );

      setImage(res.data.url);

      alert('Image Uploaded Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert('Image upload failed');
    } finally {
      setUploading(false);
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
    if (
      !name ||
      !price ||
      !category ||
      !image
    ) {
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
          image,
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
      setImage('');

      await fetchProducts();

      alert('Product Added Successfully');
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          'Failed to add product',
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
          'Failed to delete product',
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
    setEditCategory(
      product.category?._id || '',
    );
  };

  // Update Product
  const updateProduct = async () => {
    if (
      !editName ||
      !editPrice ||
      !editCategory
    ) {
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
          'Failed to update product',
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
          fontSize: '22px',
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
        background:
          'linear-gradient(to right, #eef2ff, #f8fafc)',
        padding: '40px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#ffffff',
          padding: '30px',
          borderRadius: '24px',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.08)',
          marginBottom: '30px',
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#111827',
            fontSize: '36px',
            fontWeight: 'bold',
          }}
        >
          Products Management
        </h1>
      </div>

      {/* Add Product Card */}
      <div
        style={{
          background: '#ffffff',
          padding: '30px',
          borderRadius: '24px',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.08)',
          marginBottom: '35px',
          maxWidth: '550px',
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

        {/* Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            borderRadius: '14px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            borderRadius: '14px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            borderRadius: '14px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            color: '#111827',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="">
            Select Category
          </option>

          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Upload Image */}
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              uploadImage(
                e.target.files[0],
              );
            }
          }}
          style={{
            marginBottom: '20px',
            color: '#111827',
          }}
        />

        {/* Preview */}
        {image && (
          <img
            src={image}
            alt="product"
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover',
              borderRadius: '16px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb',
            }}
          />
        )}

        {/* Add Button */}
        <button
          onClick={addProduct}
          disabled={adding || uploading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            borderRadius: '14px',
            background:
              adding || uploading
                ? '#93c5fd'
                : '#2563eb',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 700,
            cursor:
              adding || uploading
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {uploading
            ? 'Uploading Image...'
            : adding
            ? 'Adding Product...'
            : 'Add Product'}
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
              borderRadius: '14px',
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
                padding: '20px',
                borderRadius: '18px',
                marginBottom: '18px',
                boxShadow:
                  '0 5px 20px rgba(0,0,0,0.05)',
              }}
            >
              {/* Product Image */}
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '14px',
                    marginBottom: '15px',
                  }}
                />
              )}

              <h3
                style={{
                  margin: 0,
                  color: '#111827',
                  marginBottom: '10px',
                }}
              >
                {p.name}
              </h3>

              <p
                style={{
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Price: ৳ {p.price}
              </p>

              <p
                style={{
                  color: '#6b7280',
                  marginBottom: '15px',
                }}
              >
                Category:{' '}
                {p.category?.name ||
                  'No Category'}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  onClick={() =>
                    startEdit(p)
                  }
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(p._id)
                  }
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#dc2626',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}