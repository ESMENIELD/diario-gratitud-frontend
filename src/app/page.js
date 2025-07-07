'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './Login/context/AuthContext'

export default function IndexRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/home' : '/login-auth')
    }
  }, [user, loading, router])

  return <p>Cargando...</p>
}
