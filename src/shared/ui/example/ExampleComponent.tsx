// ============================================
// ПРИМЕР: Демонстрация правил линтера
// Этот файл показывает правильное использование
// ============================================

import { useState, type FC, type ReactNode } from 'react'

// ✅ Интерфейс в PascalCase
interface ExampleCardProps {
  title: string
  description?: string
  children?: ReactNode
  onAction?: () => void
}

// ✅ Компонент - стрелочная функция с именованным экспортом
export const ExampleCard: FC<ExampleCardProps> = ({ title, description, children, onAction }) => {
  // ✅ Boolean переменные с префиксами
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Используем const для неизменяемых значений
  const hasDescription = Boolean(description)
  const canShowAction = Boolean(onAction)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleAction = async () => {
    if (!onAction) return

    setIsLoading(true)
    try {
      await onAction()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="example-card">
      {/* ✅ Self-closing теги */}
      <div className="card-header">
        <h3>{title}</h3>
        <button onClick={handleToggle}>{isExpanded ? 'Свернуть' : 'Развернуть'}</button>
      </div>

      {/* ✅ Условный рендеринг без лишних скобок */}
      {hasDescription && <p className="description">{description}</p>}

      {/* ✅ Fragment syntax */}
      {isExpanded && (
        <>
          <div className="card-content">{children}</div>

          {/* ✅ Boolean prop без значения */}
          {canShowAction && (
            <button onClick={handleAction} disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Выполнить действие'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ============================================
// Еще один пример компонента
// ============================================

interface BadgeProps {
  text: string
  variant?: 'success' | 'warning' | 'error'
}

// ✅ Простой компонент - стрелочная функция
export const Badge = ({ text, variant = 'success' }: BadgeProps) => {
  const className = `badge badge-${variant}`

  return <span className={className}>{text}</span>
}

// ============================================
// Использование:
// ============================================
// import { ExampleCard, Badge } from './ExampleComponent'
//
// <ExampleCard
//   title="Заголовок"
//   description="Описание карточки"
//   onAction={() => console.log('Action!')}
// >
//   <Badge text="Новое" variant="success" />
//   <p>Контент внутри карточки</p>
// </ExampleCard>
