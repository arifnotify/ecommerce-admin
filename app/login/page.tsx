'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post('/auth/login', {
        email,
        password,
      });

      // API response থেকে data নেওয়া
      const { access_token, user } = res.data;

      // শুধু admin login করতে পারবে
      if (user?.role !== 'admin') {
        alert('Only admin can login');

        // যদি token আগে save হয়ে থাকে remove করে দিবে
        Cookies.remove('token');

        return;
      }

      // token save
      Cookies.set('token', access_token);

      // dashboard এ redirect
      router.push('/dashboard');
    } catch (err) {
      alert('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f4f7fb',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#ffffff',
          padding: '35px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '10px',
            color: '#111827',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          Admin Login
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '30px',
            fontSize: '14px',
          }}
        >
          Please login to continue
        </p>

        {/* Email */}
        <div style={{ marginBottom: '18px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#374151',
              fontWeight: 500,
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '15px',
              boxSizing: 'border-box',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '25px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#374151',
              fontWeight: 500,
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '15px',
              boxSizing: 'border-box',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px',
            border: 'none',
            borderRadius: '10px',
            background: loading ? '#93c5fd' : '#2563eb',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: '0.3s',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
// https://chatgpt.com/share/6a1aeb96-cfc0-83eb-a520-7850defed560
