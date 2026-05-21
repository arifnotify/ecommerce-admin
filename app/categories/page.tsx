'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const token = Cookies.get('token');

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  // EDIT
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // UI STATES
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  // AUTH CHECK
  useEffect(() => {
    if (!token) router.push('/');
    else fetchCategories();
  }, []);

  // FETCH
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
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
    } catch {
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // EDIT START
  const startEdit = (c: any) => {
    setEditId(c._id);
    setEditName(c.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  // UPDATE
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

  // FILTER SEARCH
  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / limit);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  if (loading) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: 30, background: '#f4f7fb', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h1>Categories Management</h1>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search category..."
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      />

      {/* ADD */}
      <div style={{ background: '#fff', padding: 20, marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <button onClick={addCategory} disabled={adding}>
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {/* LIST */}
      {paginated.map((c: any) => (
        <div
          key={c._id}
          style={{
            background: '#fff',
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* LEFT */}
          <div style={{ flex: 1 }}>
            {editId === c._id ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ padding: 8, width: '100%' }}
              />
            ) : (
              <h3 style={{ margin: 0 }}>{c.name}</h3>
            )}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: 8 }}>
            {editId === c._id ? (
              <>
                <button
                  onClick={() => updateCategory(c._id)}
                  disabled={updating}
                >
                  Save
                </button>

                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(c)}>Edit</button>

                <button
                  onClick={() => deleteCategory(c._id)}
                  disabled={deletingId === c._id}
                >
                  {deletingId === c._id ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}