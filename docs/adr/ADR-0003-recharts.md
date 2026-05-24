# ADR-0003: Recharts for Data Visualization
Date: 2026-05-24
Status: Accepted

## Context
OpsCore needs charting for KPI trend lines, sparklines, bar charts on the dashboard, and anomaly visualizations. The library must integrate with React 18+ and respect the design token system.

## Decision
Use **Recharts** for all data visualization.

## Consequences
- Positive: Declarative React API — charts are components. Easy to integrate with design tokens via custom themes and CSS variables.
- Positive: Built-in responsive container, tooltip, and legend components. Good default animations.
- Positive: SVG-based rendering — crisp at all resolutions, accessible via ARIA labels.
- Negative: Bundle size (~45 KB gzipped). Mitigated by route-level code splitting so charts only load on pages that use them.
- Negative: Less composable than visx for highly custom visualizations. Acceptable for dashboard-style charts.

## Alternatives considered
- **visx:** More composable and lower-level, but requires significantly more code for standard chart types (line, bar, area). Better for bespoke data viz, overkill for KPI dashboards.
- **Chart.js / react-chartjs-2:** Canvas-based, less accessible, harder to style with CSS variables.
- **Nivo:** Good library but adds another dependency layer. Recharts is more widely adopted.
