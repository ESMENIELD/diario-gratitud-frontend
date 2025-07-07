
'use client';

import './globals.css';
import { AuthProvider } from './Login/context/AuthContext';
import Header from './components/Header';


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
        <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}