"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminHome() {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    setJwt(localStorage.getItem('jwt_admin'));
  }, []);

  return (
    <main id="content" className="min-h-screen p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Painel</h1>
        {!jwt ? (
          <Link className="underline" href="/login">Entrar</Link>
        ) : (
          <button className="underline" onClick={() => { localStorage.removeItem('jwt_admin'); location.reload(); }}>Sair</button>
        )}
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link href="/products" className="border rounded p-4">Produtos</Link>
        <Link href="/orders" className="border rounded p-4">Pedidos</Link>
        <Link href="/notifications" className="border rounded p-4">Notificações</Link>
      </section>
    </main>
  );
}