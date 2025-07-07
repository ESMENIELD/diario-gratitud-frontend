'use client';
import { useState, useEffect, useRef } from 'react';
import { FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { getAuth } from 'firebase/auth';

const defaultFrequencies = [
  { title: 'Armonía 432Hz', link: 'https://www.youtube.com/watch?v=2JvJ25DL2qI' },
  { title: 'Amor 639Hz', link: 'https://www.youtube.com/watch?v=Iit3OHyNnPk' },
  { title: 'Salud 285Hz', link: 'https://www.youtube.com/watch?v=YoNA5D66zT8' },
  { title: 'Prosperidad 528Hz', link: 'https://www.youtube.com/watch?v=1Z9pqST72is' },
  { title: 'Éxito 963Hz', link: 'https://www.youtube.com/watch?v=t7I1VC3R2jw' }
];

export default function EntryForm({ onSave, initialData = null, onClose }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    frequency_link: '',
    frequency_title: ''
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const pickerRef = useRef();

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        content: initialData.content || '',
        frequency_link: initialData.frequency_link || '',
        frequency_title: initialData.frequency_title || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onEmojiClick = (emojiData) => {
    setForm((prev) => ({ ...prev, content: prev.content + emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleFrequencyClick = (freq) => {
    setForm({ ...form, frequency_link: freq.link, frequency_title: freq.title });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const isEditing = initialData && initialData.id;
      const endpoint = isEditing
        ? `http://localhost:3001/api/entries/${initialData.id}`
        : 'http://localhost:3001/api/entries';
      const method = isEditing ? 'PUT' : 'POST';

      // Incluye el id explícitamente si estás editando
      const payload = isEditing
        ? { ...form, id: initialData.id }
        : form;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al guardar la entrada');
      const entry = await response.json();
      await onSave(entry);

      setFeedbackMessage(isEditing ? '✅ Entrada actualizada' : '✅ Entrada guardada');

      if (!isEditing) {
        setForm({
          title: '',
          content: '',
          frequency_link: '',
          frequency_title: ''
        });
      }

      setTimeout(() => {
        setFeedbackMessage('');
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al guardar la entrada.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">
        {initialData ? 'Editar entrada ✨' : 'Nueva entrada 🌼'}
      </h1>

      {feedbackMessage && (
        <p className="text-green-600 font-medium">{feedbackMessage}</p>
      )}

      <input
        className="w-full border border-purple-300 p-2 rounded-lg"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Título del agradecimiento"
        required
      />
      <div className="relative">
        <textarea
          className="w-full border border-purple-300 p-2 rounded-lg"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Escribí tu gratitud..."
          required
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute top-2 right-2 text-xl text-purple-500 hover:scale-110"
        >
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div ref={pickerRef} className="absolute z-50 top-full mt-2">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <input
        className="w-full border border-purple-300 p-2 rounded-lg"
        name="frequency_link"
        value={form.frequency_link}
        onChange={handleChange}
        placeholder="Link de frecuencia personalizada (opcional)"
      />
      <input
        className="w-full border border-purple-300 p-2 rounded-lg"
        name="frequency_title"
        value={form.frequency_title}
        onChange={handleChange}
        placeholder="Título de la frecuencia personalizada (ej: Paz 432Hz)"
      />
      <div className="flex flex-wrap gap-2">
        {defaultFrequencies.map((freq) => (
          <button
            type="button"
            key={freq.title}
            onClick={() => handleFrequencyClick(freq)}
            className="bg-purple-400 text-white px-3 py-1 rounded hover:bg-purple-500"
          >
            {freq.title}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          {initialData ? 'Actualizar entrada' : 'Guardar entrada'}
        </button>
      </div>
    </form>
  );
}
