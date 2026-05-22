'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Orders</h1>

      {orders.map((o: any) => (
        <div key={o._id} style={{ marginBottom: 20 }}>
          <p>Total: {o.totalAmount}</p>
          <p>Status: {o.status}</p>
        </div>
      ))}
    </div>
  );
}