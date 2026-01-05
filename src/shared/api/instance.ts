// ============================================
// ПРИМЕР: Базовая настройка API клиента
// ============================================
import axios from 'axios'

import { getAuthToken } from '@/features/Auth/lib/tokenStorage'

/**
 * Базовый URL API из переменных окружения
 * Настраивается в файле .env через VITE_API_URL
 * По умолчанию: https://stage.clickfood.pro/api
 */
const API_URL = import.meta.env.VITE_API_URL || 'https://stage.clickfood.pro/api'

// Debug: показываем какой API URL используется
// eslint-disable-next-line no-console
console.log('🌐 API Base URL:', API_URL)

// Создаем экземпляр axios
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - добавляем JWT токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken() // Используем наш tokenStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - обрабатываем глобальные ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если 401 - редиректим на логин
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
