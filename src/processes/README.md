# Processes Layer (Слой процессов)

## 📋 Назначение

Слой **processes** содержит сложные межстраничные бизнес-процессы, которые:
- Связывают несколько страниц
- Управляют сложными пользовательскими сценариями
- Координируют работу нескольких фич

> **Примечание:** Этот слой является **опциональным** и используется редко. Большинство приложений могут обойтись без него.

## 📁 Структура

```
processes/
├── checkout/              # Процесс оформления заказа
│   ├── model/            # Бизнес-логика процесса
│   ├── ui/               # UI компоненты процесса
│   └── index.ts          # Public API
├── onboarding/           # Процесс онбординга пользователя
└── README.md            # Эта документация
```

## 🎯 Принципы

1. **Межстраничность** - процесс затрагивает несколько страниц
2. **Сложность** - процесс включает несколько этапов
3. **Координация** - процесс управляет несколькими фичами

## 💡 Примеры использования

### Пример 1: Процесс оформления заказа (Checkout)

```tsx
// processes/checkout/model/useCheckoutProcess.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

export const useCheckoutProcess = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const navigate = useNavigate();

  const goToNextStep = () => {
    const steps: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      navigate(`/checkout/${nextStep}`);
    }
  };

  const goToPrevStep = () => {
    const steps: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      navigate(`/checkout/${prevStep}`);
    }
  };

  return {
    currentStep,
    goToNextStep,
    goToPrevStep,
  };
};
```

### Пример 2: Процесс онбординга

```tsx
// processes/onboarding/model/useOnboarding.ts
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/shared/lib/hooks';

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
}

export const useOnboarding = () => {
  const [state, setState] = useLocalStorage<OnboardingState>('onboarding', {
    isCompleted: false,
    currentStep: 0,
    totalSteps: 3,
  });

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
    }));
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      isCompleted: true,
    }));
  };

  const resetOnboarding = () => {
    setState({
      isCompleted: false,
      currentStep: 0,
      totalSteps: 3,
    });
  };

  return {
    ...state,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding,
  };
};
```

### Пример 3: UI компонент процесса

```tsx
// processes/checkout/ui/CheckoutProgress.tsx
import { useCheckoutProcess } from '../model/useCheckoutProcess';

const STEPS = [
  { id: 'cart', label: 'Корзина' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'payment', label: 'Оплата' },
  { id: 'confirmation', label: 'Подтверждение' },
];

export const CheckoutProgress = () => {
  const { currentStep } = useCheckoutProcess();
  const currentIndex = STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="checkout-progress">
      {STEPS.map((step, index) => (
        <div
          key={step.id}
          className={`step ${index <= currentIndex ? 'active' : ''}`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};
```

## 🤔 Когда использовать processes?

### ✅ Используйте processes для:

- **Многошаговых форм** - регистрация, оформление заказа, анкеты
- **Онбординга** - приветственные экраны для новых пользователей
- **Сложных workflow** - процессы утверждения, модерации

### ❌ НЕ используйте processes для:

- **Простых UI взаимодействий** - используйте features
- **Локальной логики страницы** - используйте pages
- **Переиспользуемых компонентов** - используйте shared/ui

## 🔄 Взаимодействие с другими слоями

```
processes
   ↓ использует
pages + features + entities
   ↓ использует
shared
```

## ⚠️ Важные замечания

- В большинстве приложений этот слой **НЕ нужен**
- Если сомневаетесь - скорее всего вам нужна **feature**, а не **process**
- Процессы должны быть действительно **межстраничными**
