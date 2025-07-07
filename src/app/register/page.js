'use client';
import { useState } from 'react';
import { useAuth } from '../Login/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, pass);
      router.push('/dashboard');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Registrarse</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full p-2 border rounded" type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} required />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Crear cuenta</button>
      </form>
    </div>
  );
}
