export default function EntryItem({ entry, onEdit, onDelete }) {
  return (
    <li className="p-4 border border-purple-200 rounded-2xl bg-white shadow-md space-y-2">
      <h2 className="font-semibold text-lg text-purple-800">{entry.title}</h2>
      <p className="text-gray-700 whitespace-pre-line">{entry.content}</p>

      {entry.frequency_link && entry.frequency_title && (
        <a
          href={entry.frequency_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-500 text-white px-4 py-1 rounded-lg hover:bg-purple-600"
        >
          Frecuencia para intencionar: {entry.frequency_title}
        </a>
      )}

      <p className="text-sm text-gray-500">
        {new Date(entry.created_at).toLocaleString('es-AR', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </p>

      {entry.updated_at !== entry.created_at && (
        <p className="text-sm text-gray-500">
          Editado:{' '}
          {new Date(entry.updated_at).toLocaleString('es-AR', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onEdit(entry)}
          className="text-sm bg-purple-800 text-white px-3 py-1 rounded hover:bg-purple-900"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
