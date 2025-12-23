# 🔧 Руководство по ESLint и Prettier

## 📋 Установленные инструменты

Проект настроен с профессиональной конфигурацией линтинга и форматирования:

- **ESLint** - статический анализ кода
- **Prettier** - автоматическое форматирование кода
- **TypeScript ESLint** - правила для TypeScript
- **React ESLint Plugins** - правила для React компонентов

---

## 🎯 Основные правила проекта

### 1. Неиспользуемые переменные

Линтер будет **предупреждать** (warn) о неиспользуемых переменных:

```tsx
// ❌ Плохо - будет предупреждение
const unusedVariable = 'test'

// ✅ Хорошо - используем переменную
const usedVariable = 'test'
console.log(usedVariable)

// ✅ Хорошо - игнорируем с префиксом _
const _intentionallyUnused = 'test'
```

### 2. Именование компонентов (PascalCase)

Все React компоненты должны быть в PascalCase:

```tsx
// ✅ Правильно
export const MyComponent = () => {
  return <div>Hello</div>
}

// ✅ Правильно
export const UserProfile = () => {
  return <div>Profile</div>
}

// ❌ Неправильно - lowercase
export const mycomponent = () => {
  return <div>Hello</div>
}

// ❌ Неправильно - camelCase
export const myComponent = () => {
  return <div>Hello</div>
}
```

### 3. Стрелочные функции для компонентов

Все компоненты **обязательно** должны быть стрелочными функциями:

```tsx
// ✅ Правильно - стрелочная функция
export const MyComponent = () => {
  return <div>Hello</div>
}

// ✅ Правильно - с пропсами
export const MyButton = ({ label }: { label: string }) => {
  return <button>{label}</button>
}

// ❌ Неправильно - function declaration
function MyComponent() {
  return <div>Hello</div>
}

// ❌ Неправильно - function expression
export const MyComponent = function() {
  return <div>Hello</div>
}
```

### 4. Именованные экспорты

Компоненты должны экспортироваться как именованные экспорты:

```tsx
// ✅ Правильно - именованный экспорт
export const MyComponent = () => {
  return <div>Hello</div>
}

// ✅ Правильно - использование
import { MyComponent } from './MyComponent'

// ❌ Неправильно - default export (старайтесь избегать)
export default MyComponent
```

---

## 📝 Дополнительные лучшие практики

### TypeScript

```tsx
// ✅ Используйте type imports
import type { FC, ReactNode } from 'react'

// ✅ Правильное именование типов - PascalCase
type UserData = {
  id: number
  name: string
}

interface ButtonProps {
  label: string
  onClick: () => void
}

// ✅ Boolean переменные с префиксами
const isLoading = true
const hasError = false
const canSubmit = true
const shouldRender = true
```

### React

```tsx
// ✅ Self-closing теги
<MyComponent />
<div />

// ❌ Избегайте
<MyComponent></MyComponent>
<div></div>

// ✅ Boolean props без значения
<Button disabled />

// ❌ Избегайте
<Button disabled={true} />

// ✅ Используйте Fragment syntax
<>
  <div>First</div>
  <div>Second</div>
</>

// ❌ Избегайте
<React.Fragment>
  <div>First</div>
  <div>Second</div>
</React.Fragment>
```

---

## 🛠 Команды для работы

### Базовые команды

```bash
# Проверка кода линтером
pnpm run lint

# Автоматическое исправление проблем линтера
pnpm run lint:fix

# Форматирование кода с Prettier
pnpm run format

# Проверка форматирования (без изменений)
pnpm run format:check

# Проверка типов TypeScript
pnpm run type-check

# Полная проверка (типы + линтер + форматирование)
pnpm run check-all

# Автоматическое исправление всех проблем
pnpm run fix-all
```

### Рекомендуемый workflow

1. **Перед коммитом:**
```bash
pnpm run fix-all
```

2. **Проверка перед push:**
```bash
pnpm run check-all
```

---

## 🎨 Настройки Prettier

Проект использует следующие настройки форматирования:

- **Без точки с запятой** (`semi: false`)
- **Одинарные кавычки** (`singleQuote: true`)
- **Ширина строки: 100 символов** (`printWidth: 100`)
- **Отступы: 2 пробела** (`tabWidth: 2`)
- **Trailing commas в ES5** (`trailingComma: 'es5'`)

---

## 💡 Интеграция с редактором

### VSCode

Был создан файл `.vscode-settings.json.example` с рекомендуемыми настройками.

Чтобы использовать его:

1. Скопируйте файл:
```bash
cp .vscode-settings.json.example .vscode/settings.json
```

2. Установите расширения:
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

3. Перезапустите VSCode

Теперь код будет автоматически форматироваться при сохранении! ✨

---

## 🚫 Игнорирование правил

Иногда необходимо отключить правило для конкретной строки:

```tsx
// Отключить правило для следующей строки
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const element = document.getElementById('root')!

// Отключить правило для всего файла (используйте редко!)
/* eslint-disable @typescript-eslint/no-explicit-any */

// Отключить несколько правил
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-console
const unused = console.log('debug')
```

⚠️ **Важно:** Используйте игнорирование правил только когда это действительно необходимо!

---

## 📚 Примеры правильного кода

### Полноценный компонент

```tsx
import type { FC } from 'react'
import { useState } from 'react'

interface UserCardProps {
  name: string
  email: string
  onDelete?: () => void
}

export const UserCard: FC<UserCardProps> = ({ name, email, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    onDelete?.()
  }

  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {onDelete && (
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      )}
    </div>
  )
}
```

### Пользовательский хук

```tsx
import { useState, useEffect } from 'react'

interface UseDataResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export const useData = <T,>(url: string): UseDataResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading, error }
}
```

---

## 🎓 Дополнительные ресурсы

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)

---

**Настройка выполнена как Senior Engineer! 🚀**

Все ваши требования реализованы:
- ✅ Подсветка неиспользуемых переменных
- ✅ Именование компонентов в PascalCase
- ✅ Обязательное использование стрелочных функций
- ✅ Именованные экспорты `export const MyComponent = () => {}`
