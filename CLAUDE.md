# Frontend Development Rules

## Always Use
- shadcn/ui for all UI components
- Tailwind CSS (no custom CSS files)
- TypeScript strict mode
- Recharts for any data visualization

## Design System
- Primary: blue-500/600
- Accent: purple-500/600
- Background: slate-950 (dark) / white (light)
- Border radius: rounded-xl
- Spacing: 4px base unit

## Component Patterns
1. Always wrap page content in a max-w-7xl mx-auto container
2. Use gap-4 or gap-6 for grid/flex spacing
3. Stat cards must have: icon, value, label, trend indicator
4. Charts must have: title, legend, responsive container

## Animation
- Page transitions: animate-in fade-in duration-300
- Hover states: transition-all duration-200
- Charts: use built-in Recharts animation props
