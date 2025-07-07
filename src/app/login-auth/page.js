'use client';
import { useState } from 'react';
import { useAuth } from '../Login/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, pass);
      router.push('/dashboard');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-purple-900 mb-8">Diario de gratitud</h1>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 mb-6 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl" />
          <span className="text-gray-800 font-medium text-base sm:text-lg">Inicia con Google</span>
        </button>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-4 space-y-2 text-sm">
          <a href="/reset" className="text-purple-600 hover:underline block">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="/register" className="text-purple-600 hover:underline block">
            Crear una cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
