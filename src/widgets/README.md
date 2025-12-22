# Widgets Layer (Слой виджетов)

## 📋 Назначение

Слой **widgets** содержит крупные самостоятельные UI блоки:
- Композитные компоненты из нескольких фич
- Большие независимые блоки интерфейса
- Переиспользуемые секции страниц

## 📁 Структура

```
widgets/
├── header/                    # Шапка сайта
│   ├── ui/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   └── index.ts
├── product-card/             # Карточка товара
│   ├── ui/
│   │   ├── ProductCard.tsx
│   │   └── ProductCard.module.css
│   └── index.ts
├── cart-summary/             # Итоги корзины
│   ├── model/               # Логика виджета (опционально)
│   ├── ui/
│   └── index.ts
└── README.md
```

## 🎯 Принципы

1. **Композиция** - виджет может использовать features и entities
2. **Самостоятельность** - виджет несет законченную функциональность
3. **Переиспользуемость** - можно использовать на разных страницах

## 💡 Примеры использования

### Пример 1: Шапка сайта (Header)

```tsx
// widgets/header/ui/Header.tsx
import { Logo } from '@/shared/ui/logo';
import { SearchBar } from '@/features/search';
import { CartButton } from '@/features/cart/ui/CartButton';
import { AuthButton } from '@/features/auth/ui/AuthButton';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        <SearchBar />
        <div className={styles.actions}>
          <CartButton />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
```

```ts
// widgets/header/index.ts
export { Header } from './ui/Header';
```

### Пример 2: Карточка товара

```tsx
// widgets/product-card/ui/ProductCard.tsx
import { Product } from '@/entities/product';
import { AddToCartButton } from '@/features/cart/add-to-cart';
import { FavoriteButton } from '@/features/favorites/toggle-favorite';
import { Price } from '@/shared/ui/price';
import { Rating } from '@/shared/ui/rating';
import { Badge } from '@/shared/ui/badge';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className={styles.card}>
      {product.discount && (
        <Badge className={styles.badge}>-{product.discount}%</Badge>
      )}
      
      <FavoriteButton 
        productId={product.id} 
        className={styles.favorite}
      />
      
      <img 
        src={product.image} 
        alt={product.name}
        className={styles.image}
      />
      
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        
        <Rating value={product.rating} />
        
        <div className={styles.footer}>
          <Price 
            value={product.price}
            oldValue={product.oldPrice}
          />
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
};
```

### Пример 3: Виджет с логикой (CartSummary)

```tsx
// widgets/cart-summary/model/useCartSummary.ts
import { useCart } from '@/entities/cart';
import { usePromoCode } from '@/features/promo-code';

export const useCartSummary = () => {
  const { items, subtotal } = useCart();
  const { discount, promoCode } = usePromoCode();
  
  const deliveryFee = subtotal > 1000 ? 0 : 200;
  const total = subtotal - discount + deliveryFee;
  
  return {
    items,
    subtotal,
    discount,
    promoCode,
    deliveryFee,
    total,
  };
};
```

```tsx
// widgets/cart-summary/ui/CartSummary.tsx
import { useCartSummary } from '../model/useCartSummary';
import { PromoCodeInput } from '@/features/promo-code';
import { formatPrice } from '@/shared/lib/format';
import styles from './CartSummary.module.css';

export const CartSummary = () => {
  const { 
    items, 
    subtotal, 
    discount, 
    promoCode,
    deliveryFee, 
    total 
  } = useCartSummary();

  return (
    <div className={styles.summary}>
      <h3>Итого</h3>
      
      <div className={styles.line}>
        <span>Товары ({items.length})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      
      {discount > 0 && (
        <div className={styles.line}>
          <span>Скидка ({promoCode})</span>
          <span className={styles.discount}>
            -{formatPrice(discount)}
          </span>
        </div>
      )}
      
      <div className={styles.line}>
        <span>Доставка</span>
        <span>
          {deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee)}
        </span>
      </div>
      
      <PromoCodeInput />
      
      <div className={styles.total}>
        <span>Итого</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
};
```

```ts
// widgets/cart-summary/index.ts
export { CartSummary } from './ui/CartSummary';
export { useCartSummary } from './model/useCartSummary';
```

### Пример 4: Список товаров с фильтрацией

```tsx
// widgets/product-list/ui/ProductList.tsx
import { useProducts } from '@/entities/product';
import { ProductCard } from '@/widgets/product-card';
import { Skeleton } from '@/shared/ui/skeleton';
import { EmptyState } from '@/shared/ui/empty-state';
import styles from './ProductList.module.css';

interface ProductListProps {
  categoryId?: string;
  limit?: number;
}

export const ProductList = ({ categoryId, limit }: ProductListProps) => {
  const { data: products, isLoading } = useProducts({ 
    categoryId, 
    limit 
  });

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} height={400} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState 
        title="Товары не найдены"
        description="Попробуйте изменить параметры поиска"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};
```

### Пример 5: Навигация по категориям

```tsx
// widgets/category-nav/ui/CategoryNav.tsx
import { useCategories } from '@/entities/category';
import { CategoryButton } from '@/shared/ui/category-button';
import { Skeleton } from '@/shared/ui/skeleton';
import styles from './CategoryNav.module.css';

interface CategoryNavProps {
  activeId?: string;
  onChange?: (categoryId: string) => void;
}

export const CategoryNav = ({ activeId, onChange }: CategoryNavProps) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className={styles.nav}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={120} height={48} />
        ))}
      </div>
    );
  }

  return (
    <nav className={styles.nav}>
      {categories?.map(category => (
        <CategoryButton
          key={category.id}
          category={category}
          active={category.id === activeId}
          onClick={() => onChange?.(category.id)}
        />
      ))}
    </nav>
  );
};
```

## 🎨 Когда создавать виджет?

### ✅ Создавайте виджет когда:

- Компонент **композитный** (состоит из нескольких фич/сущностей)
- Компонент **переиспользуется** на нескольких страницах
- Компонент **самостоятельный** (имеет законченную функциональность)
- Компонент **крупный** (более 100-150 строк кода)

### ❌ НЕ создавайте виджет когда:

- Компонент **простой** (кнопка, инпут) → используйте `shared/ui`
- Компонент **это фича** (добавить в корзину) → используйте `features`
- Компонент **используется 1 раз** → оставьте в `pages`

## ⚠️ Что НЕ должно быть в widgets

- ❌ Прямые API запросы (используйте entities)
- ❌ Простые UI компоненты (используйте shared/ui)
- ❌ Глобальное состояние (используйте entities или app)

## ✅ Что ДОЛЖНО быть в widgets

- ✅ Композиция из features + entities + shared
- ✅ Локальная логика виджета (в model)
- ✅ Стили виджета
- ✅ Обработка состояний загрузки/ошибок

## 🔄 Взаимодействие с другими слоями

```
widgets
   ↓ импортирует
features + entities + shared
   ↓ импортируют
shared
```

## 📝 Naming Convention

- Имя папки: `kebab-case` (product-card, cart-summary)
- Имя компонента: `PascalCase` (ProductCard, CartSummary)
- Файлы стилей: `[Component].module.css`
