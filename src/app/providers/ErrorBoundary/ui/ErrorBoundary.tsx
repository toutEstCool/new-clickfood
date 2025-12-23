import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'
import { logError, getErrorContext } from '../lib/errorLogger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, errorInfo?: ErrorInfo, resetError?: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary - компонент для отлова ошибок React
 *
 * Особенности:
 * - Красивый fallback UI с различными режимами для dev/prod
 * - Централизованное логирование ошибок
 * - Возможность восстановления (reset)
 * - Настраиваемый fallback компонент
 * - TypeScript типизация
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example С кастомным fallback
 * ```tsx
 * <ErrorBoundary fallback={(error, errorInfo, reset) => (
 *   <CustomErrorPage error={error} onReset={reset} />
 * )}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Обновляем state, чтобы следующий рендер показал fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Сохраняем errorInfo в state
    this.setState({
      errorInfo,
    })

    // Логируем ошибку
    logError({
      error,
      errorInfo,
      context: getErrorContext(),
    })

    // Вызываем кастомный обработчик, если передан
    this.props.onError?.(error, errorInfo)
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      // Если передан кастомный fallback - используем его
      if (fallback) {
        return fallback(error, errorInfo ?? undefined, this.resetError)
      }

      // Иначе используем дефолтный ErrorFallback
      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo ?? undefined}
          resetError={this.resetError}
        />
      )
    }

    return children
  }
}
