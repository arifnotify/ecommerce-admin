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

  // Multiple Images
  const [images, setImages] = useState<string[]>(
    [],
  );

  // Upload State
  const [uploading, setUploading] =
    useState(false);

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

  // Upload Multiple Images
  const uploadImages = async (
    files: FileList,
  ) => {
    try {
      setUploading(true);

      const uploadedImages: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();

        formData.append('file', file);

        const res = await api.post(
          '/upload',
          formData,
        );

        uploadedImages.push(res.data.url);
      }

      setImages(uploadedImages);

      alert('Images Uploaded Successfully');
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
      images.length === 0
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
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Reset
      setName('');
      setPrice('');
      setCategory('');
      setImages([]);

      // Reload Products
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

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
          }}
        >
          Upload and manage ecommerce products
        </p>
      </div>

      {/* Add Product */}
      <div
        style={{
          background: '#ffffff',
          padding: '30px',
          borderRadius: '24px',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.08)',
          marginBottom: '35px',
          maxWidth: '650px',
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
            outline: 'none',
            boxSizing: 'border-box',
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
            outline: 'none',
            boxSizing: 'border-box',
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
            outline: 'none',
            boxSizing: 'border-box',
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

        {/* Upload Images */}
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              uploadImages(e.target.files);
            }
          }}
          style={{
            marginBottom: '20px',
            color: '#111827',
          }}
        />

        {/* Images Preview */}
        {images.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="product"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  border:
                    '1px solid #e5e7eb',
                }}
              />
            ))}
          </div>
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
            ? 'Uploading Images...'
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
                padding: '24px',
                borderRadius: '20px',
                marginBottom: '20px',
                boxShadow:
                  '0 5px 20px rgba(0,0,0,0.05)',
              }}
            >
              {/* Images */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '18px',
                }}
              >
                {p.images?.map(
                  (
                    img: string,
                    index: number,
                  ) => (
                    <img
                      key={index}
                      src={img}
                      alt={p.name}
                      style={{
                        width: '110px',
                        height: '110px',
                        objectFit: 'cover',
                        borderRadius: '14px',
                      }}
                    />
                  ),
                )}
              </div>

              {/* Product Name */}
              <h3
                style={{
                  margin: 0,
                  marginBottom: '10px',
                  color: '#111827',
                  fontSize: '24px',
                }}
              >
                {p.name}
              </h3>

              {/* Price */}
              <p
                style={{
                  color: '#374151',
                  marginBottom: '8px',
                  fontSize: '16px',
                }}
              >
                Price: ৳ {p.price}
              </p>

              {/* Category */}
              <p
                style={{
                  color: '#6b7280',
                  marginBottom: '18px',
                }}
              >
                Category:{' '}
                {p.category?.name ||
                  'No Category'}
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '10px',
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
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#dc2626',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 600,
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
