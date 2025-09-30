"use client";
import { useState } from 'react';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('jwt_admin')!;
    await fetch(base + '/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, body }),
    });
    setTitle('');
    setBody('');
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Enviar notificação</h1>
      <form onSubmit={send} className="flex flex-col gap-3 max-w-md">
        <label>
          <span className="block text-sm">Título</span>
          <input className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span className="block text-sm">Mensagem</span>
          <textarea className="w-full border px-3 py-2 rounded" value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <button className="bg-black text-white px-4 py-2 rounded">Enviar</button>
      </form>
    </main>
  );
}