"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function registerDeviceToken(token: string, jwt: string) {
    await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000') + '/api/devices/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ deviceToken: token }),
    }).catch(() => {});
  }

  async function getFcmToken() {
    try {
      // dynamic import to avoid SSR issues
      const { initializeApp } = await import('firebase/app');
      const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
      if (!(await isSupported())) return null;
      const app = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      });
      const messaging = getMessaging(app);
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: registration,
      });
      return token;
    } catch (e) {
      return null;
    }
  }

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
    localStorage.setItem('jwt', data.token);
    const deviceToken = await getFcmToken();
    if (deviceToken) await registerDeviceToken(deviceToken, data.token);
    window.location.href = '/profile';
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Entrar</h1>
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
      <p className="mt-2 text-sm">Sem conta? <Link href="/register" className="underline">Registre-se</Link></p>
    </main>
  );
}