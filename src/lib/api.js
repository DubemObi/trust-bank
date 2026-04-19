import axios from 'axios'
import { toast } from 'sonner'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001'
const TOKEN_KEY = 'swiftcash_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data
    const message =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.title ||
      data?.error ||
      error.message ||
      'Something went wrong'

    if (status === 401) {
      tokenStore.clear()
      if (onUnauthorized) onUnauthorized()
      toast.error('Session expired. Please log in again.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again.')
    } else if (status !== 404) {
      toast.error(typeof message === 'string' ? message : 'Request failed')
    }

    return Promise.reject(error)
  },
)

export const extractError = (error) => {
  const data = error?.response?.data
  return (
    (typeof data === 'string' && data) ||
    data?.message ||
    data?.title ||
    data?.error ||
    error?.message ||
    'Request failed'
  )
}