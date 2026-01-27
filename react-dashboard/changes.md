# Build Error Fixes Documentation

**Date:** 2026-01-27

This document tracks the changes made to resolve TypeScript build errors in the React Dashboard project.

## 1. `src/components/ChallangeItem.tsx`

**Issue:** Unused variable `err` (TS6133).

**Before:**
```typescript
.catch((err) => {
    toast.error('Your flag might be incorect!');
    setIsSubmitting(false)
})
```

**After:**
```typescript
.catch(() => {
    toast.error('Your flag might be incorect!');
    setIsSubmitting(false)
})
```

**Reason:** Removed the unused `err` parameter to comply with TypeScript's no-unused-vars rule.

## 2. `src/components/CompetitionsPages/Announcements.tsx`

**Issue:** `isVisible` property missing on `Announcement` type, and `icon` type incompatibility (TS2339, TS2503).

**Before:**
```typescript
{ icon: JSX.Element; borderColor: string; badgeColor: string }
// ...
const visibleAnnouncements = res.data.data.filter(a => a.isVisible);
```

**After:**
```typescript
{ icon: React.ReactNode; borderColor: string; badgeColor: string; isVisible?: boolean }
// ...
const visibleAnnouncements = res.data.data.filter(a => a.isVisible);
```

**Reason:** Updated the interface to include `isVisible` and changed `icon` to `React.ReactNode` to be more compatible.

## 3. `src/components/CompetitionsPages/Certificates.tsx`

**Issue:** `backgroundColor: null` is not assignable to `string | undefined` (TS2322).

**Before:**
```typescript
const dataUrl = await htmlToImage.toPng(hiddenCertificateRef.current, {
  backgroundColor: null,
  pixelRatio: 1,
  cacheBust: true,
});
```

**After:**
```typescript
const dataUrl = await htmlToImage.toPng(hiddenCertificateRef.current, {
  backgroundColor: undefined,
  pixelRatio: 1,
  cacheBust: true,
});
```

**Reason:** `html-to-image` options expect `undefined` for transparent background, not `null`.

## 4. `src/components/CurvedLoop.tsx`

**Issue:** Implicit `any` types and property access on `never` (TS7006, TS7031, TS2339).

**Before:**
```typescript
const CurvedLoop = ({ className, text, ...props }) => {
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  // ...
  const onPointerDown = e => { ... }
```

**After:**
```typescript
interface CurvedLoopProps {
  className?: string;
  text: string;
  // ...
}
const CurvedLoop = ({ className, text, ...props }: CurvedLoopProps) => {
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  // ...
  const onPointerDown = (e: React.PointerEvent) => { ... }
```

**Reason:** Added component interface and explicitly typed refs and event handlers to resolve implicit `any` and allow access to DOM element properties.

## 5. `src/components/ScrollVelocity.tsx`

**Issue:** Implicit `any` types on callback parameters (TS7006).

**Before:**
```typescript
const x = useTransform(baseX, v => { ... })
useAnimationFrame((t, delta) => { ... })
```

**After:**
```typescript
const x = useTransform(baseX, (v: number) => { ... })
useAnimationFrame((t: number, delta: number) => { ... })
```

**Reason:** Explicitly typed parameters for `useTransform` and `useAnimationFrame` callbacks.

## 6. `src/components/TargetCursor.tsx`

**Issue:** Extensive implicit `any` errors, `window.opera` property missing, and property access on `never` (TS2339, TS7006, TS7034).

**Before:**
```typescript
const cursorRef = useRef(null);
const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const moveCursor = useCallback((x, y) => { ... });
```

**After:**
```typescript
const cursorRef = useRef<HTMLDivElement>(null);
const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
const moveCursor = useCallback((x: number, y: number) => { ... });
```

**Reason:** 
- Added `TargetCursorProps` interface.
- Typed `useRef` hooks (`HTMLDivElement`, `gsap.core.Timeline`, etc.).
- Cast `window` to `any` to access legacy `opera` property.
- Added null checks for refs (e.g., `spinTl.current?.kill()`).
- Typed event handlers and utility function parameters.

## 7. `src/territories/landing/CompetitionById.tsx`

**Issue:** Invalid state typing and incorrect property names (TS2339).

**Before:**
```typescript
const [competitions, setCompetitions] = useState<Competition | {}>({})
// ...
{competitions.startDate}
{competitions.endDate}
```

**After:**
```typescript
const [competitions, setCompetitions] = useState<Competition | null>(null)
// ...
{competitions.startTime}
{competitions.endTime}
```

**Reason:** 
- Changed state type to `Competition | null` to correctly represent data availability.
- Corrected property names from `startDate`/`endDate` to `startTime`/`endTime` to match the `Competition` interface.

## 8. `src/territories/landing/CompetitionsPage.tsx`

**Issue:** Implicit `never[]` state type causing property access errors (TS2339).

**Before:**
```typescript
const [competitions, setCompetitions] = useState([])
// ...
{competition.title || competition.name}
```

**After:**
```typescript
const [competitions, setCompetitions] = useState<Competition[]>([])
// ...
{competition.name}
```

**Reason:** 
- Explicitly typed state as `useState<Competition[]>([])`.
- Removed fallback to `title` as it does not exist on `Competition` type; `name` is the correct property.

## 9. `src/territories/platform/LearningPage.tsx`

**Issue:** Property `totalPages` does not exist on `PaginatedResponse` (TS2339).

**Before:**
```typescript
setTotalPages(response.data.totalPages || 1)
```

**After:**
```typescript
setTotalPages(response.data.pagination.pages || 1)
```

**Reason:** Aligned code with the API response structure where pagination info is nested under `pagination` object.
