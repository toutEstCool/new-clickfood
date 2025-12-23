import { useState } from 'react'

/**
 * Тестовый компонент для проверки ErrorBoundary
 * Используйте его для тестирования отлова ошибок
 */
export const ErrorTestComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    // Симулируем ошибку рендеринга
    throw new Error('🧪 Тестовая ошибка from ErrorTestComponent')
  }

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Тестирование ErrorBoundary</h2>
      <p className="text-gray-600 mb-4">
        Нажмите кнопку ниже, чтобы симулировать ошибку и проверить работу ErrorBoundary
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
      >
        🧨 Вызвать ошибку
      </button>
    </div>
  )
}
