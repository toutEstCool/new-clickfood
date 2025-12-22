// ============================================
// ПРИМЕР: Компонент кнопки из shared/ui
// Это базовый переиспользуемый компонент
// ============================================

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading && <span className={styles.spinner} />}
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
        </button>
    );
};

// ============================================
// Использование:
// ============================================
// import { Button } from '@/shared/ui/button';
//
// <Button variant="primary" size="md">
//   Нажми меня
// </Button>
//
// <Button variant="outline" loading>
//   Загрузка...
// </Button>
