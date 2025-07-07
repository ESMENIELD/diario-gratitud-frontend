'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Login/context/AuthContext';
import ProtectedRoute from '../Login/components/ProtectedRoute';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleNewEntry = () => router.push('/home');

  return (
    <ProtectedRoute>
      <div className="p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">¡Hola {user?.displayName || user?.email}!</h2>
        <p className="text-gray-600">¿Qué deseas hacer hoy?</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleNewEntry} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Ir al diario
          </button>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cerrar sesión
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
