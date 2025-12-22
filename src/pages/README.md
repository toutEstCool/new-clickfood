# Pages Layer (Слой страниц)

## 📋 Назначение

Слой **pages** содержит страницы приложения. Каждая страница:
- Представляет собой отдельный маршрут (route)
- Компонует фичи и виджеты для конкретного экрана
- Управляет layout-ом страницы

## 📁 Структура

```
pages/
├── home/                  # Главная страница
│   ├── ui/
│   │   └── HomePage.tsx
│   └── index.ts          # public API: export { HomePage } from './ui/HomePage'
├── catalog/              # Страница каталога
│   ├── ui/
│   │   └── CatalogPage.tsx
│   └── index.ts
├── product/              # Страница товара
│   ├── model/           # Логика страницы (опционально)
│   ├── ui/
│   │   └── ProductPage.tsx
│   └── index.ts
└── README.md
```

## 🎯 Принципы

1. **Композиция** - страница собирает готовые виджеты и фичи
2. **Минимум логики** - основная логика в features/widgets
3. **Один маршрут = одна страница**

## 💡 Примеры использования

### Пример 1: Простая страница с композицией виджетов

```tsx
// pages/home/ui/HomePage.tsx
import { Header } from '@/widgets/header';
import { CategoryNav } from '@/widgets/category-nav';
import { ProductList } from '@/widgets/product-list';
import { Footer } from '@/widgets/footer';

export const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <CategoryNav />
        <ProductList />
      </main>
      <Footer />
    </div>
  );
};
```

```ts
// pages/home/index.ts
export { HomePage } from './ui/HomePage';
```

### Пример 2: Страница с параметрами из URL

```tsx
// pages/product/ui/ProductPage.tsx
import { useParams } from 'react-router-dom';
import { ProductDetails } from '@/widgets/product-details';
import { RecommendedProducts } from '@/widgets/recommended-products';
import { ReviewsList } from '@/widgets/reviews-list';

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <div className="product-page">
      <ProductDetails productId={productId!} />
      <ReviewsList productId={productId!} />
      <RecommendedProducts productId={productId!} />
    </div>
  );
};
```

### Пример 3: Страница с локальным состоянием

```tsx
// pages/catalog/ui/CatalogPage.tsx
import { useState } from 'react';
import { FilterPanel } from '@/widgets/filter-panel';
import { ProductGrid } from '@/widgets/product-grid';
import { Pagination } from '@/shared/ui/pagination';

export const CatalogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  return (
    <div className="catalog-page">
      <aside>
        <FilterPanel filters={filters} onChange={setFilters} />
      </aside>
      <main>
        <ProductGrid 
          filters={filters} 
          page={currentPage} 
        />
        <Pagination 
          current={currentPage}
          onChange={setCurrentPage}
        />
      </main>
    </div>
  );
};
```

### Пример 4: Страница с логикой в model

```tsx
// pages/checkout/model/useCheckoutPage.ts
import { useState } from 'react';
import { useCart } from '@/entities/cart';
import { useUser } from '@/entities/user';

export const useCheckoutPage = () => {
  const { items, total } = useCart();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Логика оформления заказа
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    items,
    total,
    user,
    isProcessing,
    handleCheckout,
  };
};
```

```tsx
// pages/checkout/ui/CheckoutPage.tsx
import { useCheckoutPage } from '../model/useCheckoutPage';
import { CartSummary } from '@/widgets/cart-summary';
import { DeliveryForm } from '@/widgets/delivery-form';
import { PaymentForm } from '@/widgets/payment-form';
import { Button } from '@/shared/ui/button';

export const CheckoutPage = () => {
  const { items, total, isProcessing, handleCheckout } = useCheckoutPage();

  return (
    <div className="checkout-page">
      <div className="checkout-content">
        <CartSummary items={items} />
        <DeliveryForm />
        <PaymentForm />
      </div>
      <div className="checkout-summary">
        <div className="total">Итого: {total} ₽</div>
        <Button 
          onClick={handleCheckout}
          disabled={isProcessing}
          loading={isProcessing}
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};
```

### Пример 5: Конфигурация роутинга

```tsx
// app/router/routes.tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { CatalogPage } from '@/pages/catalog';
import { ProductPage } from '@/pages/product';
import { CheckoutPage } from '@/pages/checkout';
import { NotFoundPage } from '@/pages/not-found';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:productId" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
```

## 🎨 Структура папки model (опционально)

Если страница имеет собственную логику, можно добавить папку `model`:

```
pages/catalog/
├── model/
│   ├── useCatalogPage.ts      # Хук с логикой страницы
│   ├── useCatalogFilters.ts   # Хук для работы с фильтрами
│   └── index.ts               # export { useCatalogPage } from './useCatalogPage'
├── ui/
│   └── CatalogPage.tsx
└── index.ts
```

## ⚠️ Что НЕ должно быть в pages

- ❌ Переиспользуемые компоненты (используйте shared/ui)
- ❌ Бизнес-логика (используйте features/entities)
- ❌ Сложные UI блоки (используйте widgets)
- ❌ API запросы напрямую (используйте entities)

## ✅ Что ДОЛЖНО быть в pages

- ✅ Композиция виджетов и фичей
- ✅ Layout страницы
- ✅ Работа с URL параметрами
- ✅ Локальное состояние страницы (фильтры, пагинация)

## 🔄 Взаимодействие с другими слоями

```
pages
   ↓ импортирует
widgets + features
   ↓ импортируют
entities + shared
```

## 📝 Naming Convention

- Имя папки: `kebab-case` (home, product-list, user-profile)
- Имя компонента: `PascalCase` + суффикс `Page` (HomePage, ProductListPage)
- Файлы: `PascalCase.tsx` (HomePage.tsx, ProductPage.tsx)
