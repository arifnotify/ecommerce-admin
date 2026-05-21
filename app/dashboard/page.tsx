'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // যদি token না থাকে login page এ পাঠাবে
        if (!token) {
          router.push('/');
          return;
        }

        const res = await api.get('/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(res.data);
      } catch (error) {
        console.log(error);

        alert('Failed to load dashboard');

        // token invalid হলে login এ পাঠাবে
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

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
        Loading Dashboard...
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
          Dashboard
        </h1>

        <p
          style={{
            marginTop: '10px',
            color: '#6b7280',
            fontSize: '15px',
          }}
        >
          Welcome to your admin panel
        </p>
      </div>

      {/* Stats Card */}
      <div
        style={{
          background: '#2563eb',
          padding: '25px',
          borderRadius: '16px',
          color: '#ffffff',
          maxWidth: '300px',
          boxShadow: '0 10px 25px rgba(37,99,235,0.3)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            opacity: 0.9,
          }}
        >
          Total Products
        </h2>

        <h1
          style={{
            marginTop: '10px',
            fontSize: '42px',
            fontWeight: 'bold',
          }}
        >
          {products.length}
        </h1>
      </div>
    </div>
  );
}