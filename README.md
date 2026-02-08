# Consolidated Core - Next.js Dashboard

Modern, modular dashboard for education consultancies in Nepal.

## Features

- ✅ **Lazy Switch Pattern** - All dashboards render simultaneously, visibility toggled with CSS
- ✅ **Global State Management** - DataContext prevents re-fetching when switching tabs
- ✅ **Chart.js Integration** - Proper cleanup to prevent memory leaks
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **TypeScript** - Type-safe development

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── layout/            # Header, Sidebar
│   ├── dashboards/        # CEO, Marketing, Call Center, Sales & Visa
│   └── common/            # MetricCard, Modal, ChartWrapper
├── context/               # DataContext for global state
└── utils/                 # CSV parser, data processing
```

## Data Sources

- Marketing: Google Sheets (CSV)
- Call Center: Apps Script API + localStorage cache
- Sales & Visa: Apps Script API

## Build for Production

```bash
npm run build
npm start
```
