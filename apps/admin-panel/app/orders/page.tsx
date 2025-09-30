"use client";
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [items, setItems] = useState<any[]>([]);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('jwt_admin');
    if (!token) return;
    fetch(base + '/api/orders/all', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Pedidos</h1>
      <ul className="space-y-2">
        {items.map((o) => (
          <li key={o.id} className="border rounded p-2 flex justify-between">
            <span>{o.id}</span>
            <span>{o.user_email}</span>
            <span>{(o.total_cents/100).toLocaleString('pt-BR',{style:'currency',currency:o.currency||'USD'})}</span>
            <span className="uppercase">{o.status}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}