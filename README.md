# Travel App

Клієнтський застосунок для пошуку турів.

## Запуск

**Вимоги:** Node.js 18+, npm 9+

```bash
npm install
npm start
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

### Тести

```bash
npm test
```

### Продакшн-збірка

```bash
npm run build
```

---

## Про проект

Застосунок дозволяє знайти тури за напрямком (країна, місто або готель) і переглянути результати у вигляді карток, відсортованих за ціною.

### Архітектура

Проект побудований на 4-шаровій архітектурі:

```
src/
├── models/          # TypeScript-типи та селектори (buildTours)
├── services/        # Бізнес-логіка: polling, кеш, geo
├── hooks/           # Тонкі React-обгортки над сервісами
└── components/
    ├── primitives/  # Input, Button, Popover
    ├── composed/    # Combobox = Popover + Input
    └── features/    # SearchForm, TourCard, TourList
```

### Стек

- React 19, TypeScript
- [@floating-ui/react](https://floating-ui.com/) — позиціонування Popover
- CSS Modules — ізольовані стилі без UI-бібліотек
- Jest + Testing Library — 21 тест
