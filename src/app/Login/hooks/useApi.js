'use client';
import { getAuth } from "firebase/auth";

// Hook para hacer fetch con el token de Firebase incluido automáticamente
export const useApi = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const request = async (endpoint, options = {}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    // Obtener token de Firebase
    const token = await user.getIdToken();

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Error en request: ${res.status} ${res.statusText}`);
    }

    return res.json();
  };

  return { request };
};
