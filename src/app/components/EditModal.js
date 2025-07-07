'use client';
import { useEffect, useRef } from 'react';
import EntryForm from './EntryForm';

export default function EditModal({ isOpen, onClose, entry, onSave }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <div
        ref={modalRef}
        className="relative bg-white border border-purple-200 p-4 rounded-2xl shadow-lg w-full max-w-sm"
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
