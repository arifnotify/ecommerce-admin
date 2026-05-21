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
  const [categories, setCategories] =
    useState<any[]>([]);

  // Add Product State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] =
    useState('');
  const [image, setImage] = useState('');

  // Upload State
  const [uploading, setUploading] =
    useState(false);

  // Edit Product State
  const [editingId, setEditingId] =
    useState('');

  const [editName, setEditName] =
    useState('');

  const [editPrice, setEditPrice] =
    useState('');

  const [editCategory, setEditCategory] =
    useState('');

  const [editImage, setEditImage] =
    useState('');

  // Loading State
  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState('');

  // Logout
  const logout = () => {
    Cookies.remove('token');

    router.push('/');

    alert('Logged out successfully');
  };

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

  // Upload Add Image
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

      alert(
        'Image Uploaded Successfully',
      );
    } catch (error: any) {
      console.log(error.response?.data);

      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Upload Edit Image
  const uploadEditImage = async (
    file: File,
  ) => {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('file', file);

      const res = await api.post(
        '/upload',
        formData,
      );

      setEditImage(res.data.url);

      alert(
        'Edit Image Uploaded Successfully',
      );
    } catch (error: any) {
      console.log(error.response?.data);

      alert('Edit image upload failed');
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

      alert(
        'Product Added Successfully',
      );
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
  const deleteProduct = async (
    id: string,
  ) => {
    try {
      setDeletingId(id);

      const token = Cookies.get('token');

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProducts();

      alert(
        'Product Deleted Successfully',
      );
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

    setEditPrice(
      String(product.price),
    );

    setEditCategory(
      product.category?._id || '',
    );

    setEditImage(product.image || '');
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
          image: editImage,
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

      setEditImage('');

      await fetchProducts();

      alert(
        'Product Updated Successfully',
      );
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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

        <button
          onClick={logout}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '12px',
            background: '#dc2626',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
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
          maxWidth: '550px',
        }}
      >
        <h2>Add New Product</h2>

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
          }}
        />

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
          }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
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
          }}
        />

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
            }}
          />
        )}

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
          }}
        >
          Product List
        </h2>

        {products.length === 0 ? (
          <div>No products found</div>
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
              {editingId === p._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value,
                      )
                    }
                    placeholder="Product Name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  />

                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) =>
                      setEditPrice(
                        e.target.value,
                      )
                    }
                    placeholder="Price"
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  />

                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(
                        e.target.value,
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '15px',
                    }}
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (c: any) => (
                        <option
                          key={c._id}
                          value={c._id}
                        >
                          {c.name}
                        </option>
                      ),
                    )}
                  </select>

                  <input
                    type="file"
                    onChange={(e) => {
                      if (
                        e.target.files
                      ) {
                        uploadEditImage(
                          e.target
                            .files[0],
                        );
                      }
                    }}
                    style={{
                      marginBottom:
                        '15px',
                    }}
                  />

                  {editImage && (
                    <img
                      src={editImage}
                      alt="preview"
                      style={{
                        width: '140px',
                        height: '140px',
                        objectFit:
                          'cover',
                        borderRadius:
                          '12px',
                        marginBottom:
                          '15px',
                        border:
                          '1px solid #ddd',
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <button
                      onClick={
                        updateProduct
                      }
                      style={{
                        padding:
                          '10px 18px',
                        border: 'none',
                        borderRadius:
                          '10px',
                        background:
                          '#16a34a',
                        color:
                          '#ffffff',
                        cursor:
                          'pointer',
                      }}
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(
                          '',
                        );

                        setEditName(
                          '',
                        );

                        setEditPrice(
                          '',
                        );

                        setEditCategory(
                          '',
                        );

                        setEditImage(
                          '',
                        );
                      }}
                      style={{
                        padding:
                          '10px 18px',
                        border: 'none',
                        borderRadius:
                          '10px',
                        background:
                          '#6b7280',
                        color:
                          '#ffffff',
                        cursor:
                          'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit:
                          'cover',
                        borderRadius:
                          '14px',
                        marginBottom:
                          '15px',
                      }}
                    />
                  )}

                  <h3>{p.name}</h3>

                  <p>
                    Price: ৳ {p.price}
                  </p>

                  <p>
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
                        padding:
                          '10px 18px',
                        border: 'none',
                        borderRadius:
                          '10px',
                        background:
                          '#2563eb',
                        color:
                          '#ffffff',
                        cursor:
                          'pointer',
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          p._id,
                        )
                      }
                      style={{
                        padding:
                          '10px 18px',
                        border: 'none',
                        borderRadius:
                          '10px',
                        background:
                          '#dc2626',
                        color:
                          '#ffffff',
                        cursor:
                          'pointer',
                      }}
                    >
                      {deletingId ===
                      p._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
