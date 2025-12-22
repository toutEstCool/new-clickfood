# 📂 Структура проекта

```
clickfood/
├── public/                      # Статические файлы
├── src/                        
│   ├── app/                     # 🚀 Слой приложения
│   │   ├── providers/          # React провайдеры (будут созданы)
│   │   ├── styles/             
│   │   │   └── global.css       # ✅ Глобальные стили
│   │   ├── App.tsx              # ✅ Главный компонент
│   │   └── README.md            # ✅ Документация
│   │
│   ├── processes/               # 🔄 Межстраничные процессы
│   │   └── README.md            # ✅ Документация
│   │
│   ├── pages/                   # 📄 Страницы приложения
│   │   └── README.md            # ✅ Документация
│   │
│   ├── widgets/                 # 🧩 Крупные UI блоки
│   │   └── README.md            # ✅ Документация
│   │
│   ├── features/                # ⚡️ Бизнес-функциональность
│   │   └── README.md            # ✅ Документация
│   │
│   ├── entities/                # 📦 Бизнес-сущности
│   │   └── README.md            # ✅ Документация
│   │
│   ├── shared/                  # 🔧 Переиспользуемый код
│   │   ├── ui/                  # UI Kit
│   │   │   └── button/          # ✅ Пример: кнопка
│   │   │       ├── Button.tsx
│   │   │       ├── Button.module.css
│   │   │       └── index.ts
│   │   ├── lib/                 # Библиотеки и утилиты
│   │   │   ├── hooks/           # React хуки
│   │   │   │   └── useDebounce.ts  # ✅ Пример
│   │   │   └── utils/           # Утилиты
│   │   │       └── format.ts    # ✅ Пример
│   │   ├── api/                 # API клиент
│   │   │   ├── instance.ts      # ✅ Настройка axios
│   │   │   ├── types.ts         # ✅ API типы
│   │   │   └── index.ts         # ✅ Public API
│   │   ├── config/              # Конфигурация
│   │   ├── types/               # Общие типы
│   │   ├── assets/              # Статические ресурсы
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   └── README.md            # ✅ Документация
│   │
│   ├── main.tsx                 # ✅ Точка входа
│   └── README.md                # ✅ Главная документация FSD
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json            # ✅ Настроены path aliases
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts               # ✅ Настроены path aliases
├── README.md                    # ✅ Документация проекта
└── GETTING_STARTED.md           # ✅ Руководство по началу

```

## 📊 Статистика

### ✅ Создано:
- **7 README.md** с подробной документацией каждого слоя
- **Примеры компонентов** в shared/ui (Button)
- **Примеры хуков** в shared/lib (useDebounce)
- **Примеры утилит** в shared/lib (format)
- **Настроенный API клиент** с axios
- **Глобальные стили** с CSS переменными
- **Path aliases** для удобных импортов
- **Руководство GETTING_STARTED.md**

### 🎯 Готово к использованию:
- ✅ Структура FSD
- ✅ TypeScript конфигурация
- ✅ Vite конфигурация
- ✅ Path aliases (@/app, @/shared, etc.)
- ✅ Глобальные стили и CSS переменные
- ✅ Примеры компонентов
- ✅ Документация с примерами

### 📝 Ключевые файлы документации:
1. `README.md` - Общая информация о проекте
2. `GETTING_STARTED.md` - Пошаговое руководство
3. `src/README.md` - Главная документация FSD
4. `src/*/README.md` - Документация каждого слоя (7 файлов)

---

## 🚀 Следующие шаги:

1. **Изучите** документацию в `src/README.md`
2. **Прочитайте** `GETTING_STARTED.md` для быстрого старта
3. **Создайте** свои первые entities (Product, User)
4. **Добавьте** features (auth, add-to-cart)
5. **Соберите** widgets из фичей
6. **Создайте** pages из виджетов

**Проект полностью готов к разработке!** 🎉
