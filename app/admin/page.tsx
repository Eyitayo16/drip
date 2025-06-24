"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const AdminPage = () => {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push("/login")
      }
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return null // or a loading indicator
  }

  if (!isAuthenticated) {
    return null // The router.push in the useEffect will handle the redirect.  Returning null prevents brief flashes of content.
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome to the admin area!</p>
    </div>
  )
}

export default AdminPage
