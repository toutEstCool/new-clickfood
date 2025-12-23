import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error
  errorInfo?: React.ErrorInfo
  resetError?: () => void
}

export const ErrorFallback = ({ error, errorInfo, resetError }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-red-500 to-orange-500 p-6">
          <div className="flex items-center gap-3 text-white">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Упс! Что-то пошло не так</h1>
              <p className="text-red-100 text-sm mt-1">Произошла непредвиденная ошибка</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Мы уже работаем над исправлением этой проблемы. Пожалуйста, попробуйте обновить страницу
            или вернуться позже.
          </p>

          {/* Dev mode - показываем детали ошибки */}
          {isDev && (
            <div className="mt-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Детали ошибки (только в dev режиме):
                </h3>
                <p className="text-sm text-red-700 font-mono break-all">{error.message}</p>
              </div>

              {errorInfo?.componentStack && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="text-sm font-semibold text-gray-800 cursor-pointer">
                    Component Stack
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {error.stack && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="text-sm font-semibold text-gray-800 cursor-pointer">
                    Error Stack
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {resetError && (
              <button
                onClick={resetError}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-4 h-4" />
                Попробовать снова
              </button>
            )}
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
