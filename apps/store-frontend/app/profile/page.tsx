"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000') + '/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (!user) return <main className="p-6">Carregando...</main>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Perfil</h1>
      <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded overflow-auto" aria-label="Dados do usuário">{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}