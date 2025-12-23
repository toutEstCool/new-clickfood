// ============================================
// ПРИМЕР: Утилиты форматирования
// ============================================

/**
 * Форматирование цены в рублях
 * @example formatPrice(1500) => "1 500 ₽"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Форматирование даты
 * @example formatDate(new Date()) => "22 декабря 2025 г."
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Склонение числительных
 * @example pluralize(5, 'товар', 'товара', 'товаров') => "товаров"
 */
export const pluralize = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
