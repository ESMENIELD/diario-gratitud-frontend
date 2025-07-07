'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import DownloadPDFButton from '../components/DownloadPDFButton';
import { useAuth } from '../Login/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login-auth');
    }
  }, [loading, user]);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      const token = await user.getIdToken();
      console.log("token:", token);
      
      const res = await fetch('http://localhost:3001/api/entries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
      console.log("entradas:", data);
      
    } catch (err) {
      console.error('Error al obtener entradas:', err);
    }
  };

  const handleSave = async (form) => {
    const token = await user.getIdToken();
    const res = await fetch('http://localhost:3001/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const newEntry = await res.json();
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdate = async (form) => {
    const token = await user.getIdToken();
    const res = await fetch(`http://localhost:3001/api/entries/${form.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const updatedEntry = await res.json();
    setEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  const handleDelete = async (id) => {
    const token = await user.getIdToken();
    await fetch(`http://localhost:3001/api/entries/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
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
