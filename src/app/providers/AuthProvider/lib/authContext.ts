import { createContext } from 'react'
import type { UserRole } from '@/shared/types/router'

export interface JwtUser {
  id: string
  role: UserRole
  source?: string
}

export interface AuthContextProps {
  user: JwtUser | null
  isAuth: boolean
  authStatus: 'authenticated' | 'unauthenticated'
  token: string | null
  isInitializing: boolean
  logout: () => void
  refetch: () => void
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)
