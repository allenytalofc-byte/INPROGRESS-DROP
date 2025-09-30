"use client";
import { useEffect, useState } from 'react';

export default function ProductsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', price_cents: 0 });

  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

  async function load() {
    const r = await fetch(base + '/api/products');
    setItems(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('jwt_admin')!;
    await fetch(base + '/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price_cents: Number(form.price_cents) }),
    });
    setForm({ title: '', price_cents: 0 });
    load();
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Produtos</h1>
      <form onSubmit={create} className="flex gap-2 items-end mb-4">
        <label className="flex flex-col">
          <span className="text-sm">Título</span>
          <input className="border px-2 py-1 rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Preço (centavos)</span>
          <input className="border px-2 py-1 rounded" type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} />
        </label>
        <button className="px-3 py-2 border rounded">Criar</button>
      </form>
      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="border rounded p-2 flex justify-between"><span>{p.title}</span><span>{p.price_cents}</span></li>
        ))}
      </ul>
    </main>
  );
}