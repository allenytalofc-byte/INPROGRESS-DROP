'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = Cookies.get('token')
    if (savedToken) {
      setToken(savedToken)
      fetchUserProfile(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      Cookies.remove('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })

      const { access_token, user: userData } = response.data
      
      Cookies.set('token', access_token, { expires: 7 })
      setToken(access_token)
      setUser(userData)
      
      toast.success('Login successful!')
      
      // Register device for push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        registerDeviceForNotifications(access_token)
      }
      
      router.push('/')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data)

      const { access_token, user: userData } = response.data
      
      Cookies.set('token', access_token, { expires: 7 })
      setToken(access_token)
      setUser(userData)
      
      toast.success('Registration successful!')
      
      // Register device for push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        registerDeviceForNotifications(access_token)
      }
      
      router.push('/')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/')
  }

  const registerDeviceForNotifications = async (authToken: string) => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          })

          const deviceToken = JSON.stringify(subscription)
          
          await axios.post(
            `${API_URL}/notifications/register-device`,
            {
              device_token: deviceToken,
              platform: 'web',
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
        }
      }
    } catch (error) {
      console.error('Failed to register device for notifications:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}