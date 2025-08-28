'use client';
import { useEffect, useRef } from 'react';
import EntryForm from './EntryForm';

export default function EditModal({ isOpen, onClose, entry, onSave }) {
  const modalRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    // cerrar con clic afuera
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    // cerrar con tecla Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // bloquear scroll de fondo
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Contenido del modal */}
      <div
        ref={modalRef}
        className="relative bg-white border border-purple-200 p-6 rounded-2xl shadow-lg w-full max-w-md z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 text-purple-700">Editar entrada</h2>

        <EntryForm initialData={entry} onSave={onSave} onClose={onClose} />
      </div>
    </div>
  );
}
