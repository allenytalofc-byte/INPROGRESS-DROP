"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000') + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError('Falha ao entrar');
      return;
    }
    const data = await res.json();
    // Note: trusting role from backend when using admin panel routes
    localStorage.setItem('jwt_admin', data.token);
    window.location.href = '/';
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Entrar (Admin)</h1>
      <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm">
        <label>
          <span className="block text-sm">Email</span>
          <input className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        </label>
        <label>
          <span className="block text-sm">Senha</span>
          <input className="w-full border px-3 py-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </label>
        {error && <div role="alert" className="text-red-600">{error}</div>}
        <button className="bg-black text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </main>
  );
}