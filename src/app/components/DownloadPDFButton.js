'use client';
import { useEffect, useState } from 'react';

let pdfMake = null;

export default function DownloadPDFButton({ entries }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const pdfModule = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      pdfModule.default.vfs = pdfFonts.default.vfs;
      pdfMake = pdfModule.default;
      setIsReady(true);
    })();
  }, []);

  const generatePDF = () => {
    if (!pdfMake) return;

    const content = entries.map(entry => {
      return [
        { text: entry.title, style: 'title' },
        { text: entry.content, style: 'content' },
        { text: `Modificado: ${new Date(entry.updated_at).toLocaleString()}`, style: 'date' },
        entry.frequency_link && entry.frequency_title
          ? {
              text: `🎵 Frecuencia para potenciar: ${entry.frequency_title}`,
              link: entry.frequency_link,
              style: 'link'
            }
          : '',
        { text: ' ', margin: [0, 0, 0, 10] }
      ];
    });

    const docDefinition = {
      content: content.flat(),
      styles: {
        title: {
          fontSize: 16,
          bold: true,
          color: '#6B5B95',
          margin: [0, 5]
        },
        content: {
          fontSize: 12,
          color: '#333',
          margin: [0, 5]
        },
        date: {
          fontSize: 10,
          italics: true,
          color: '#777'
        },
        link: {
          fontSize: 11,
          color: '#5e4b8b',
          decoration: 'underline',
          margin: [0, 5]
        }
      },
      
    };

    pdfMake.createPdf(docDefinition).download('mi-diario-de-gratitud.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      disabled={!isReady}
      className={`px-4 py-2 rounded mt-4 ${
        isReady ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-400 text-white'
      }`}
    >
      Descargar diario en PDF
    </button>
  );
}
