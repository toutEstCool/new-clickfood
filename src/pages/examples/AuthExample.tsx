/**
 * Example: Login Page with useAuth
 * Демонстрация использования хука useAuth для авторизации
 */

import { useState } from 'react'
import { useAuth } from '@/features/Auth'
import { UserRole } from '@/shared/types/router'

export const LoginPageExample = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')

  const { sendCode, login, isSendCodeLoading, isLoginLoading, sendCodeError, loginError } =
    useAuth()

  const handleSendCode = async () => {
    try {
      await sendCode(phone)
      setStep('code')
    } catch (error) {
      console.error('Failed to send code:', error)
    }
  }

  const handleLogin = async () => {
    try {
      await login(phone, code)
      // После успешного логина React Query автоматически обновит user
      // и ProtectedRoute разрешит доступ к защищенным роутам
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Phone Authentication</h1>

      {step === 'phone' ? (
        <div>
          <h2>Enter Phone Number</h2>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          {sendCodeError && <div style={{ color: 'red' }}>Error sending code</div>}
          <button onClick={handleSendCode} disabled={isSendCodeLoading || !phone}>
            {isSendCodeLoading ? 'Sending...' : 'Send Code'}
          </button>
        </div>
      ) : (
        <div>
          <h2>Enter Verification Code</h2>
          <p>Code sent to {phone}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          {loginError && <div style={{ color: 'red' }}>Invalid code</div>}
          <button onClick={handleLogin} disabled={isLoginLoading || !code}>
            {isLoginLoading ? 'Verifying...' : 'Login'}
          </button>
          <button onClick={() => setStep('phone')} style={{ marginLeft: '10px' }}>
            Change Phone
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Protected Dashboard with useAuth
 */
export const DashboardExample = () => {
  const { user, logout, isLogoutLoading, hasRole } = useAuth()

  if (!user) return null

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome, {user.name || user.phone}!</h1>
      <p>Role: {user.role}</p>
      <p>Email: {user.email || 'Not set'}</p>

      {hasRole(UserRole.SUPERADMIN) && (
        <div>
          <h2>Superadmin Controls</h2>
          <p>You have superadmin access!</p>
        </div>
      )}

      <button onClick={() => logout()} disabled={isLogoutLoading}>
        {isLogoutLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}

/**
 * Example: Conditional Rendering based on Auth
 */
export const AppExample = () => {
  const { isAuth, isLoading, user } = useAuth()

  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  return (
    <div>
      {isAuth ? (
        <>
          <p>Authenticated as: {user?.phone}</p>
          <DashboardExample />
        </>
      ) : (
        <LoginPageExample />
      )}
    </div>
  )
}
