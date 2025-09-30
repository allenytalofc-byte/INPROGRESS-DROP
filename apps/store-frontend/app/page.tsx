"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [theme, setTheme] = useState<'light'|'dark'>('light');

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <main id="content" className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Loja</h1>
        <nav className="flex gap-4">
          <Link href="/login" className="underline">Entrar</Link>
          <Link href="/register" className="underline">Criar conta</Link>
          <button aria-label="Alternar tema" className="px-3 py-1 border rounded" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        </nav>
      </header>
      <section className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <article key={p.id} className="border dark:border-neutral-800 rounded p-3">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="opacity-80 line-clamp-2">{p.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span>{(p.price_cents/100).toLocaleString('pt-BR',{style:'currency',currency:p.currency||'USD'})}</span>
              <Link className="underline" href={`/product/${p.id}`}>Ver</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}