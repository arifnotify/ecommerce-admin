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

  // GET ALL
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error: any) {
      console.log(error.response?.data);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // ADD
  const addCategory = async () => {
    if (!name) return alert('Enter category name');

    try {
      setAdding(true);

      await api.post(
        '/categories',
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName('');
      fetchCategories();
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'Add failed');
    } finally {
      setAdding(false);
    }
  };

  // DELETE
  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      setDeletingId(id);

      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // START EDIT
  const startEdit = (c: any) => {
    setEditId(c._id);
    setEditName(c.name);
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  // UPDATE (FIXED)
  const updateCategory = async (id: string) => {
    if (!editName) return alert('Name required');

    try {
      setUpdating(true);

      const res = await api.patch(
        `/categories/${id}`,
        { name: editName }, // backend expects { name }
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Updated:', res.data);

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, name: editName } : c
        )
      );

      cancelEdit();
    } catch (error: any) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      
      <h1 style={styles.title}>Categories Management</h1>

      {/* ADD */}
      <div style={styles.card}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          style={styles.input}
        />

        <button
          onClick={addCategory}
          disabled={adding}
          style={styles.addBtn}
        >
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {/* LIST */}
      <div style={styles.list}>
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
                <span style={styles.name}>{c.name}</span>
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

                  <button onClick={cancelEdit} style={styles.cancelBtn}>
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

/* ================= STYLES ================= */

const styles: any = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fb',
    padding: '40px',
    fontFamily: 'sans-serif',
  },

  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#111827',
  },

  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 14,
    maxWidth: 500,
    marginBottom: 25,
  },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #ddd',
    marginBottom: 10,
  },

  addBtn: {
    width: '100%',
    padding: 12,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  item: {
    background: '#fff',
    padding: 15,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: 500,
  },

  actions: {
    display: 'flex',
    gap: 8,
  },

  editInput: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },

  editBtn: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  deleteBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  saveBtn: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  cancelBtn: {
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer',
  },

  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#2563eb',
  },
};