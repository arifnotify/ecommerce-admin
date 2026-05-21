'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const token = Cookies.get('token');

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!name) return;

    try {
      setAdding(true);

      await api.post(
        '/categories',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      fetchCategories();
    } catch {
      alert('Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      setDeletingId(id);

      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (c: any) => {
    setEditId(c._id);
    setEditName(c.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const updateCategory = async (id: string) => {
    if (!editName) return;

    try {
      setUpdating(true);

      await api.put(
        `/categories/${id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, name: editName } : c
        )
      );

      cancelEdit();
    } catch {
      alert('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading Categories...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Categories</h1>
        <p style={styles.subtitle}>Manage your product categories</p>
      </div>

      {/* ADD CARD */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add New Category</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          style={styles.input}
        />

        <button
          onClick={addCategory}
          disabled={adding}
          style={styles.primaryBtn}
        >
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {/* LIST */}
      <div style={styles.listContainer}>
        {categories.map((c) => (
          <div key={c._id} style={styles.item}>
            
            <div style={{ flex: 1 }}>
              {editId === c._id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={styles.editInput}
                />
              ) : (
                <h3 style={styles.itemText}>{c.name}</h3>
              )}
            </div>

            <div style={styles.actions}>
              {editId === c._id ? (
                <>
                  <button
                    onClick={() => updateCategory(c._id)}
                    disabled={updating}
                    style={styles.saveBtn}
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(c)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(c._id)}
                    disabled={deletingId === c._id}
                    style={styles.deleteBtn}
                  >
                    {deletingId === c._id ? '...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= UI STYLES ================= */

const styles: any = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    padding: '40px',
    fontFamily: 'sans-serif',
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    margin: 0,
    color: '#111827',
  },

  subtitle: {
    marginTop: 6,
    color: '#6b7280',
  },

  card: {
    background: '#fff',
    padding: 25,
    borderRadius: 16,
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    marginBottom: 30,
    maxWidth: 500,
  },

  cardTitle: {
    marginBottom: 15,
    color: '#111827',
  },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    marginBottom: 15,
    outline: 'none',
  },

  primaryBtn: {
    width: '100%',
    padding: 12,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer',
  },

  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  item: {
    background: '#fff',
    padding: 18,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
  },

  itemText: {
    margin: 0,
    color: '#111827',
  },

  actions: {
    display: 'flex',
    gap: 8,
  },

  editInput: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #d1d5db',
  },

  editBtn: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  deleteBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  saveBtn: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  cancelBtn: {
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 600,
    color: '#2563eb',
  },
};