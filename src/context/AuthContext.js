import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { authApi, usersApi } from '@/lib/endpoints'
import { setUnauthorizedHandler, tokenStore } from '@/lib/api'

const AuthContext = createContext()

const decodeRoles = (token) => {
  try {
    const claims = jwtDecode(token)
    const roleClaim =
      claims.role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const roles = Array.isArray(roleClaim) ? roleClaim : roleClaim ? [roleClaim] : []
    return {
      roles,
      userId: claims.sub || claims.nameid,
      email: claims.email || claims.unique_name,
    }
  } catch {
    return { roles: [] }
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get())
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const claims = useMemo(() => (token ? decodeRoles(token) : { roles: [] }), [token])

  const logout = () => {
    tokenStore.clear()
    setToken(null)
    setUser(null)
    authApi.logout()
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      setUser(null)
    })
  }, [])

  const refreshUser = async () => {
    if (!token) return
    try {
      const me = await usersApi.me()
      setUser(me)
    } catch {
      setUser({
        id: claims.userId || '',
        email: claims.email || '',
        roles: claims.roles,
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      if (token) {
        await refreshUser()
      }
      setIsLoading(false)
    })()
  }, [token])

  const handleAuthResponse = (res) => {
    tokenStore.set(res.token)
    setToken(res.token)
    if (res.user) setUser(res.user)
  }

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    handleAuthResponse(res)
  }

  const register = async (data) => {
    const res = await authApi.register(data)
    handleAuthResponse(res)
  }

  const value = {
    user,
    token,
    roles: claims.roles,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}