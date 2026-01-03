# Admin Dashboard Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by Vercel Dashboard and Linear's admin interface, emphasizing:
- Clean, utility-first design prioritizing efficiency and clarity
- Data-dense layouts that remain scannable and organized
- Sophisticated use of white space despite high information density
- Minimal but purposeful micro-interactions

## Core Design Principles
1. **Information Hierarchy**: Multi-level data organization with clear visual separation
2. **Scannable Density**: Dense information presented in digestible chunks
3. **Instant Clarity**: Status, metrics, and actions immediately recognizable
4. **Contextual Actions**: Operations available exactly where needed

## Layout Architecture

### Sidebar Navigation (240px fixed width)
- Two-tier navigation structure: Primary sections + nested sub-items
- Active state: Subtle left border (3px blue-500) + slate-800 background
- Icon + label pattern for all items
- Collapsed state option (64px) showing only icons
- User profile section at bottom with role badge
- Dark background (slate-900) with slate-50 text

### Main Content Area
- Max-width container: 1400px centered with horizontal padding (px-6 to px-8)
- Page header pattern: Title (text-2xl font-semibold) + breadcrumbs + primary actions (right-aligned)
- Content sections use card containers with slate-50 backgrounds and subtle borders

### Grid System
- Dashboard metrics: 4-column grid (grid-cols-4) for stat cards
- Data tables: Full-width single column
- Form layouts: 2-column grid (grid-cols-2) for input pairs
- Detail views: 2/3 main content + 1/3 sidebar pattern

## Typography System
- Font: Inter for UI, Geist Sans for data/tables
- Scale: text-xs (captions), text-sm (body/tables), text-base (form inputs), text-lg (card headers), text-2xl (page titles), text-3xl (dashboard metrics)
- Weights: font-normal (400) for body, font-medium (500) for labels, font-semibold (600) for headers
- Line heights: Tight for metrics (leading-tight), relaxed for body (leading-relaxed)

## Spacing System (Strictly Enforced)
- Primary units: 2, 4, 8 for internal component spacing (p-2, gap-4, space-y-8)
- Section spacing: 16, 24 for major divisions (mb-16, py-24)
- Component padding: Standard p-6 for cards, p-4 for nested elements
- Gap patterns: gap-4 for grids, gap-2 for inline groups

## Component Library

### Dashboard Metrics Cards
- White background with subtle shadow (shadow-sm)
- Internal padding: p-6
- Structure: Icon (top-left, 40px slate-400) + Label (text-sm slate-600) + Metric (text-3xl font-semibold) + Trend indicator (text-sm with emerald-500/red-500)
- Height: min-h-[140px] for consistent alignment

### Data Tables
- Borderless rows with hover state (hover:bg-slate-50)
- Header: Sticky (sticky top-0), slate-100 background, font-medium, text-sm
- Cell padding: px-6 py-4
- Row actions: Appear on hover, right-aligned
- Pagination: Bottom-right with page numbers + prev/next
- Filters: Top bar with search input (left) + filter dropdowns (right)

### Forms & Inputs
- Label above input pattern with text-sm font-medium
- Input height: h-10 with rounded-md (6px)
- Focus state: ring-2 ring-blue-500 ring-offset-2
- Validation: Error text (text-sm text-red-500) below input
- Required indicator: Red asterisk after label
- Multi-column forms use gap-6 between fields

### Status Badges
- Compact pill design: px-3 py-1 rounded-full text-xs font-medium
- Color mapping: Success (emerald-100 bg, emerald-700 text), Warning (amber-100/amber-700), Error (red-100/red-700), Neutral (slate-100/slate-700)
- Consistent positioning: Right-aligned in table cells

### Action Buttons
- Primary: bg-blue-500 text-white with hover:bg-blue-600
- Secondary: bg-white border border-slate-300 with hover:bg-slate-50
- Danger: bg-red-500 text-white with hover:bg-red-600
- Icon-only: Square (h-10 w-10) with centered icon
- Button groups: gap-2 spacing, flex layout

### Charts & Visualization (Recharts)
- Card container with p-6 and title (text-lg font-semibold mb-4)
- Chart colors: Use defined palette (blue-500, emerald-500, amber-500)
- Height: 300px for standard charts, 400px for primary dashboard charts
- Axis labels: text-xs slate-600
- Tooltips: White background, shadow-lg, rounded-lg, p-2

### Modal Dialogs
- Backdrop: bg-black/50 blur effect
- Modal width: max-w-2xl for forms, max-w-4xl for complex content
- Header: pb-4 border-b with title (text-xl font-semibold)
- Footer: pt-4 border-t with right-aligned actions (gap-2)
- Close icon: Top-right absolute positioning

## Page-Specific Patterns

### Dashboard Home
- Top row: 4 metric cards (Total Users, Active Competitions, Submissions Today, Active Teams)
- Second row: 2-column layout (Recent Activity table 2/3 + Quick Actions sidebar 1/3)
- Third row: Full-width line chart showing activity over time (7-30 days)
- Fourth row: 2-column grid (Top Users table + Competition Status breakdown)

### User Management
- Search bar with real-time filtering (left-aligned, w-96)
- Role filter dropdown + Status toggle (right-aligned)
- Table columns: Avatar + Name, Email, Role (badge), Status (badge), Last Login, Actions (icon buttons)
- Bulk actions: Checkbox selection with action bar appearing at top

### Competition Management
- Tab navigation: All | Draft | Active | Completed
- Card-grid layout for competitions (grid-cols-3)
- Each card: Title, Date range, Status badge, Participant count, Edit/View actions
- Create button: Fixed bottom-right (floating action button pattern)

### Challenge Builder
- Split layout: Challenge form (left 60%) + Preview (right 40%)
- Form sections: Basic Info, Difficulty & Points, Flag Configuration, Files, Hints
- File upload: Drag-drop zone with file list below
- Hint management: Sortable list with add/remove controls

## Dark Mode Support
- Toggle in sidebar user profile section
- Dark palette: bg-slate-900 (main), bg-slate-800 (cards), text-slate-100
- Maintain all accent colors (blue-500, emerald-500, etc.)
- Borders: slate-700 in dark mode

## Responsive Breakpoints
- Desktop (lg+): Full sidebar + multi-column layouts
- Tablet (md): Collapsed sidebar + 2-column grids become single
- Mobile (base): Hidden sidebar (hamburger menu) + stacked layouts

## Iconography
Use react-icons (Lucide or Heroicons style) consistently:
- Navigation: 20px icons with 2px stroke
- Table actions: 16px icons
- Stat cards: 40px icons
- Match icon style across entire application (prefer outlined over filled)

## Images
No hero images required for this admin dashboard. All visual elements are data-driven charts, tables, and UI components. Avatar images for users should be circular (rounded-full) at 40px for tables, 64px for profile views.