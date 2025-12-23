import type { ReactNode } from 'react'
// import type { UserRole } from '@/entities/User'

export interface AppRoutesProps {
  path: string
  element: ReactNode
  authOnly?: boolean
  //   roles?: UserRole[]
}
