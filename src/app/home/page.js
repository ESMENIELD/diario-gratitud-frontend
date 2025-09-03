'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import DownloadPDFButton from '../components/DownloadPDFButton';
import { useAuth } from '../Login/context/AuthContext';
import useApi from '../hooks/useApi';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login-auth');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      const data = await api('/api/entries');
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener entradas:', err);
    }
  };

  const handleSave = async (form) => {
    try {
      const newEntry = await api('/api/entries', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setEntries((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error('Error al guardar entrada:', err);
    }
  };

  const handleUpdate = async (form) => {
    try {
      const updatedEntry = await api(`/api/entries/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
      );
    } catch (err) {
      console.error('Error al actualizar entrada:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/entries/${id}`, { method: 'DELETE' });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error al eliminar entrada:', err);
    }
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="space-y-12">
        <EntryForm onSave={handleSave} />
        <EntryList
          entries={entries}
          onDeleteEntry={handleDelete}
          onUpdateEntry={handleUpdate}
        />
        <DownloadPDFButton entries={entries} />
      </div>
    </main>
  );
}
