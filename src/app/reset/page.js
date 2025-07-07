'use client';
import { useState } from 'react';
import { useAuth } from '../Login/context/AuthContext';

export default function ResetPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMsg('Te enviamos un email con el enlace de recuperación');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recuperar contraseña</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        {msg && <p className="text-green-600">{msg}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Enviar enlace</button>
      </form>
    </div>
  );
}
