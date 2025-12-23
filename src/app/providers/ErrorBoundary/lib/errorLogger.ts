import type { ErrorInfo } from 'react'

interface ErrorLoggerOptions {
  error: Error
  errorInfo: ErrorInfo
  context?: Record<string, unknown>
}

/**
 * Централизованное логирование ошибок
 * В production здесь будет отправка в Sentry, Datadog, LogRocket и т.д.
 */
export const logError = ({ error, errorInfo, context }: ErrorLoggerOptions): void => {
  const isDev = import.meta.env.DEV

  // Консольное логирование (всегда)
  if (isDev) {
    // eslint-disable-next-line no-console
    console.group('🔴 Error Boundary caught an error')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    if (context) {
      console.error('Context:', context)
    }
    // eslint-disable-next-line no-console
    console.groupEnd()
  } else {
    // В production - минимальное логирование
    console.error('Application error:', error.message)
  }

  // В production - отправляем в систему мониторинга
  if (!isDev) {
    // TODO: Интеграция с сервисом мониторинга ошибок
    // Примеры:
    // Sentry
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //     ...context,
    //   },
    // })
    // Datadog
    // datadogLogs.logger.error('React Error Boundary', {
    //   error: error.message,
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack,
    //   ...context,
    // })
    // LogRocket
    // LogRocket.captureException(error, {
    //   tags: {
    //     type: 'error-boundary',
    //   },
    //   extra: {
    //     componentStack: errorInfo.componentStack,
    //     ...context,
    //   },
    // })
    // Custom API
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     message: error.message,
    //     stack: error.stack,
    //     componentStack: errorInfo.componentStack,
    //     timestamp: new Date().toISOString(),
    //     userAgent: navigator.userAgent,
    //     url: window.location.href,
    //     ...context,
    //   }),
    // }).catch(console.error)
  }
}

/**
 * Получение дополнительного контекста для ошибки
 */
export const getErrorContext = (): Record<string, unknown> => {
  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    // Можно добавить user info, если есть авторизация
    // user: getCurrentUser(),
  }
}
