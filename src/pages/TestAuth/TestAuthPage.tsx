import { UserRole } from '@/shared/types/router'

import { exchangeInitDataForJwt } from '@/entities/User/api/telegramAuth'

import { useAuth } from '@/features/Auth'

export const TestAuthPage = () => {
  const { user, isAuth, token, logout, hasRole } = useAuth()

  const handleLogin = async () => {
    try {
      await exchangeInitDataForJwt('', 'manual-test')
      window.location.reload()
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed! Check console for details.')
    }
  }

  const handleClearToken = () => {
    localStorage.removeItem('clickfood_jwt_token')
    window.location.reload()
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>🔐 Auth Test Page</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Страница для тестирования JWT авторизации
      </p>

      {/* Current Status */}
      <div
        style={{
          padding: '20px',
          background: isAuth ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Текущий статус</h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          <p>
            <strong>Авторизован:</strong>{' '}
            {isAuth ? (
              <span style={{ color: '#2e7d32' }}>✅ Да</span>
            ) : (
              <span style={{ color: '#c62828' }}>❌ Нет</span>
            )}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id || 'N/A'}
          </p>
          <p>
            <strong>Role:</strong> {user?.role || 'N/A'}
          </p>
          <p>
            <strong>Source:</strong> {user?.source || 'N/A'}
          </p>
          <p>
            <strong>Token:</strong>{' '}
            {token ? (
              <code style={{ fontSize: '12px', background: '#f5f5f5', padding: '2px 6px' }}>
                {token.substring(0, 30)}...
              </code>
            ) : (
              'N/A'
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Действия</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isAuth ? (
            <button
              onClick={handleLogin}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              🔑 Получить JWT токен
            </button>
          ) : (
            <>
              <button
                onClick={logout}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                🚪 Выйти (Logout)
              </button>
              <button
                onClick={() => {
                  const roles = [UserRole.USER, UserRole.PARTNER, UserRole.SUPERADMIN]
                  const results = roles.map((role) => `${role}: ${hasRole(role)}`)
                  alert(`Проверка ролей:\n${results.join('\n')}`)
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  background: '#388e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                🔍 Проверить роли
              </button>
            </>
          )}
          <button
            onClick={handleClearToken}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#757575',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            🗑️ Очистить токен
          </button>
        </div>
      </div>

      {/* Decoded JWT */}
      {token && (
        <div
          style={{
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Декодированный JWT</h2>
          <pre
            style={{
              fontSize: '13px',
              overflow: 'auto',
              background: '#fff',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            {JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          padding: '20px',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>📖 Инструкция</h2>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Нажмите "Получить JWT токен" для авторизации</li>
          <li>Токен будет сохранен в localStorage</li>
          <li>Проверьте декодированный JWT ниже</li>
          <li>Используйте "Проверить роли" для проверки прав доступа</li>
          <li>Откройте DevTools → Network для просмотра запросов</li>
          <li>Все API запросы автоматически получат Authorization header</li>
        </ol>
      </div>
    </div>
  )
}
