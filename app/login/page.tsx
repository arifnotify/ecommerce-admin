'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      Cookies.set('token', res.data.access_token);

      alert('Login Success');
      router.push('/dashboard');
    } catch (err) {
      alert('Login Failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}
