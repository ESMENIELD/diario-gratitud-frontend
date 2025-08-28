'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

const googleProvider = new GoogleAuthProvider();
const AuthContext = createContext();
const logout = () => signOut(auth);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserWithDB = async (user) => {
    if (!user) return;

    try {
      // 1. Obtener todos los usuarios de la DB
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
      const users = await res.json();

      // 2. Buscar si ya existe en DB
      const existingUser = users.find(u => u.id === user.uid);

      if (existingUser) {
        console.log("Usuario ya existe en DB:", existingUser);
        setDbUser(existingUser);
        return;
      }

      // 3. Si no existe → crearlo
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.uid,          // usamos el UID de Firebase como ID en DB
          email: user.email
        })
      });

      const newUser = await createRes.json();
      console.log("Usuario creado en DB:", newUser);
      setDbUser(newUser);
    } catch (error) {
      console.error("Error sincronizando usuario con DB:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Usuario detectado en Firebase:', user);
      setFirebaseUser(user);
      if (user) {
        await syncUserWithDB(user);
        router.push('/home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const register = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ firebaseUser, dbUser, loading, login, loginWithGoogle, register, resetPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
