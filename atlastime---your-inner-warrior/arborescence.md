# 🗺️ Project Arborescence & Logic Flow

This document outlines the architectural structure of AtlasTime and how data flows between components.

## 📁 File Structure

```text
atlastime/
├── index.html           # Entry point (PWA config, fonts, Tailwind)
├── index.tsx            # React bootstrap
├── App.tsx              # Main State Controller (Habits, Language, Theme)
├── types.ts             # TypeScript definitions (The "Source of Truth")
├── translations.ts      # i18n strings (English & French)
├── quotes.ts            # Database of 365 motivational quotes
├── sw.js                # Service Worker (Offline caching logic)
├── manifest.json        # PWA metadata & App Shortcuts
│
├── utils/
│   └── dateUtils.ts     # Core Logic: Time formatting & Spartan Stage calculation
│
└── components/
    ├── Navigation.tsx       # Bottom bar view switching
    ├── HabitList.tsx        # Dashboard container
    │   ├── HabitCard.tsx    # Individual habit summary
    │   ├── DonateCard.tsx   # Support section
    │   └── MotivationalQuote.tsx # Daily quote generator
    │
    ├── HabitDetail.tsx      # Main Interaction Hub (Tabs: Intel, History, Journal)
    │   ├── SpartanAvatar.tsx # Growth Stage Visualizer
    │   ├── HabitCalendar.tsx # Heatmap/Streak connector logic
    │   ├── TrophySection.tsx # Milestone/Award logic
    │   └── StatsGraph.tsx    # Recharts implementation for streaks
    │
    ├── StatisticsView.tsx   # Aggregated data (Best overall streak, etc.)
    ├── JournalView.tsx      # Timeline of all notes across all habits
    ├── AddHabitModal.tsx    # Form to enlist new disciplines
    ├── WidgetPreview.tsx    # Settings helper for widget workaround
    └── WidgetViewOnly.tsx   # Stripped UI for home-screen widgets
```

## ⚙️ Logic Flow

### 1. Data Persistence
- **State management:** React `useState` in `App.tsx`.
- **Persistence:** Every change to the `habits` array triggers a `useEffect` that saves the JSON string to `localStorage`.
- **Hydration:** On app load, `App.tsx` reads from `localStorage` to restore the user's journey.

### 2. The Spartan Growth Logic (`dateUtils.ts` -> `SpartanAvatar.tsx`)
1. The app calculates `ms = Date.now() - habit.lastResetDate`.
2. `getSpartanStage(ms)` converts milliseconds into a `SpartanStage` enum (INFANT to SOLDIER).
3. `SpartanAvatar` receives this stage and determines:
   - Which **Emoji** to show.
   - Which **Glow Gradient** to apply based on the theme.
   - Which **Label** to display.

### 3. Navigation
- `activeView` state determines which high-level component is rendered.
- `selectedHabitId` acts as a sub-route. If it's not null, `App.tsx` hides the main views and shows `HabitDetail`.

### 4. PWA & Offline
- `sw.js` caches `index.html` and the `esm.sh` imports on first load.
- If the user has no internet, the app loads from the Cache API, and the local data is read from `localStorage`, making it 100% functional offline.
