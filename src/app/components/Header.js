'use client';
import { useAuth } from '../Login/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <h1 className="text-xl font-bold text-purple-800">Diario de gratitud</h1>
      {user ? (
        <button onClick={logout} className="text-purple-700 hover:underline">
          Cerrar sesión
        </button>
      ) : null
      }
    </header>
  );
}
