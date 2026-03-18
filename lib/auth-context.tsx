'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo credentials
const DEMO_USERS = {
  'admin@purepath.com': {
    id: 'admin-1',
    email: 'admin@purepath.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN' as UserRole,
  },
  'user@purepath.com': {
    id: 'user-1',
    email: 'user@purepath.com',
    name: 'Demo User',
    password: 'user123',
    role: 'USER' as UserRole,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('auth-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]

      if (!demoUser || demoUser.password !== password) {
        throw new Error('Invalid email or password')
      }

      const userData: User = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
      }

      setUser(userData)
      localStorage.setItem('auth-user', JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // For demo, create a new user with USER role
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'USER',
      }

      setUser(userData)
      localStorage.setItem('auth-user', JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUser(null)
      localStorage.removeItem('auth-user')
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
