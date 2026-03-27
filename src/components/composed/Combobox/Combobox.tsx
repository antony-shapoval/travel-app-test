import React, { useRef, useEffect } from 'react';
import { Input } from '../../primitives/Input/Input';
import { Popover } from '../../primitives/Popover/Popover';
import styles from './Combobox.module.css';

export interface ComboboxOption {
  id: string | number;
  label: string;
  meta?: string;
  icon?: React.ReactNode;
}

interface ComboboxProps {
  inputValue: string;
  options: ComboboxOption[];
  open: boolean;
  placeholder?: string;
  onInputChange: (value: string) => void;
  onSelect: (option: ComboboxOption) => void;
  onOpen: () => void;
  onClose: () => void;
}

export const Combobox: React.FC<ComboboxProps> = ({
  inputValue,
  options,
  open,
  placeholder,
  onInputChange,
  onSelect,
  onOpen,
  onClose,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleInputClick = () => {
    if (!open) onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  const handleSelect = (option: ComboboxOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Input
        ref={inputRef}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => onInputChange(e.target.value)}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
      />
      <Popover open={open} anchorRef={wrapperRef as React.RefObject<HTMLElement>}>
        {options.length === 0 ? (
          <div className={styles.empty}>Нічого не знайдено</div>
        ) : (
          <ul className={styles.list}>
            {options.map((opt) => (
              <li
                key={opt.id}
                className={styles.item}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
              >
                {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
                <span className={styles.label}>{opt.label}</span>
                {opt.meta && <span className={styles.meta}>{opt.meta}</span>}
              </li>
            ))}
          </ul>
        )}
      </Popover>
    </div>
  );
};
