'use client';
import { useState } from 'react';
import EntryItem from './EntryItem';
import EditModal from './EditModal';

export default function EntryList({ entries, onDeleteEntry, onUpdateEntry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const filteredEntries = entries
    .filter((entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div>
      {/* Buscador y filtro */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Buscar entradas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-purple-300 rounded-lg shadow-sm"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full md:w-auto p-2 border border-purple-300 rounded-lg shadow-sm"
        >
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>

      {filteredEntries.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              onEdit={() => openModal(entry)}
              onDelete={() => onDeleteEntry(entry.id)}
            />
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}

      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        entry={selectedEntry}
        onSave={(updatedEntry) => {
          onUpdateEntry(updatedEntry);
          closeModal();
        }}
      />
    </div>
  );
}
