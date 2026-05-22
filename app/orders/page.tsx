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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📦 Orders Dashboard</h1>

      <div className="grid gap-4">
        {orders.map((o: any) => (
          <div
            key={o._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                Order ID: <span className="text-gray-500">{o._id}</span>
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  o.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : o.status === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {o.status}
              </span>
            </div>

            <div className="mt-3 text-gray-700">
              <p>
                💰 Total Amount:{' '}
                <span className="font-semibold">${o.totalAmount}</span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                📍 Address: {o.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}