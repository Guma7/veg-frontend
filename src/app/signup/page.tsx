'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/register')
  }, [router])
  
  return <div>Redirecionando para a página de registro...</div>
}