'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Orders Dashboard</h1>

      {orders.map((o) => (
        <div key={o._id} style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Order ID:</span>
            <span>{o._id}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Total:</span>
            <span>${o.totalAmount}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Address:</span>
            <span>{o.address}</span>
          </div>

          <div style={styles.statusRow}>
            <span
              style={{
                ...styles.status,
                backgroundColor:
                  o.status === 'pending'
                    ? '#facc15'
                    : o.status === 'delivered'
                    ? '#22c55e'
                    : '#3b82f6',
              }}
            >
              {o.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: any = {
  page: {
    padding: '20px',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    fontFamily: 'Arial',
    boxShadow: 'none',
  },

  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '0px',
    border: '1px solid #ddd',
    boxShadow: 'none',
  },

  row: {
    marginBottom: '8px',
  },

  label: {
    fontWeight: 'bold',
    marginRight: '5px',
  },

  statusRow: {
    marginTop: '10px',
  },

  status: {
    color: '#000',
    padding: '5px 10px',
    borderRadius: '0px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  },

  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};