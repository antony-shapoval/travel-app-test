import React from 'react';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => (
  <button
    className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    {...props}
  >
    {children}
  </button>
);
