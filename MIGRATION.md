# Hamo v2.0 Migration Guide

This document outlines breaking changes and new features in the modernization update.

## Breaking Changes

### Minimum React Version

**Before:** React >=17.0.0
**After:** React >=18.0.0

This change enables native `useSyncExternalStore` support without a shim, providing better concurrent rendering safety.

### API Changes

#### `useMediaQuery`

**Before:**
```tsx
const isMatch = useMediaQuery('(min-width: 768px)')
// Returns: boolean | undefined
```

**After:**
```tsx
const isMatch = useMediaQuery('(min-width: 768px)')
// Returns: boolean (always defined)

// New: SSR fallback support
const isMatch = useMediaQuery('(min-width: 768px)', true) // fallback to true on server
```

The return type is now always `boolean` instead of `boolean | undefined`. A second parameter allows specifying a server-side fallback value.

#### `useResizeObserver`

**Before:**
```tsx
const [setRef, entry] = useResizeObserver(
  { lazy: false, debounce: 500, callback: () => {} },
  [dep1, dep2] // deps array as second argument
)
```

**After:**
```tsx
const [setRef, entry] = useResizeObserver({
  lazy: false,
  debounce: 500,
  callback: () => {}
})
// deps array removed - use callback ref pattern instead
```

The `deps` parameter has been removed. If you need reactive behavior based on dependencies, use a callback ref pattern or manage state externally.

#### `useIntersectionObserver`

**Before:**
```tsx
const [setRef, entry] = useIntersectionObserver(
  { threshold: 0.5, callback: () => {} },
  [dep1, dep2] // deps array as second argument
)
```

**After:**
```tsx
const [setRef, entry] = useIntersectionObserver({
  threshold: 0.5,
  callback: () => {}
})
// deps array removed
```

Same change as `useResizeObserver` - deps array removed.

#### `useLazyState`

**Before:**
```tsx
const [set, get] = useLazyState(
  initialValue,
  callback,
  [dep1, dep2] // deps array
)
```

**After:**
```tsx
const [set, get] = useLazyState(initialValue, callback)
// deps array removed
// callback is now optional
```

#### `useRect`

**Before:**
```tsx
const [setRef, rect, setWrapperRef] = useRect(
  { ignoreTransform: false, debounce: 500, callback: () => {} },
  [dep1, dep2] // deps array
)
```

**After:**
```tsx
const [setRef, rect, setWrapperRef] = useRect({
  ignoreTransform: false,
  debounce: 500,
  callback: () => {}
})
// deps array removed
```

### TypeScript Changes

All hooks now have improved TypeScript types:

- Proper generic inference for `lazy` mode return types
- Removed `@ts-ignore` comments
- Stricter option types with proper defaults

## New Features

### Selective Window Size Hooks

New granular hooks that only re-render when the specific dimension changes:

```tsx
import { useWindowWidth, useWindowHeight, useWindowDpr } from 'hamo'

function MyComponent() {
  // Only re-renders when width changes
  const width = useWindowWidth()

  // Only re-renders when height changes
  const height = useWindowHeight()

  // Only re-renders when DPR changes
  const dpr = useWindowDpr()
}
```

This follows the selective subscription pattern from `useSyncExternalStore`, reducing unnecessary re-renders.

### SSR Safety

All hooks now include SSR safety checks:

```tsx
// These hooks safely return undefined/fallback values during SSR
const { width, height, dpr } = useWindowSize()        // All undefined on server
const isMatch = useMediaQuery('(min-width: 768px)')   // false on server (or custom fallback)
const [setRef, entry] = useResizeObserver()           // entry is undefined on server
```

### Concurrent Rendering Support

Hooks that subscribe to external stores now use `useSyncExternalStore` for tear-free reads in concurrent mode:

- `useWindowSize` / `useWindowWidth` / `useWindowHeight` / `useWindowDpr`
- `useMediaQuery`
- `useRect` (for the global resize emitter)

## Removed Features

### Spread Dependencies Pattern

The pattern of spreading a `deps` array into `useEffect` dependencies has been removed:

```tsx
// Before (problematic with React Compiler and strict mode)
useEffect(() => { ... }, [element, debounce, ...deps])

// After (cleaner, more predictable)
useEffect(() => { ... }, [element, debounce])
```

If you relied on this pattern, refactor to use:
1. The `callback` option (which uses a ref internally)
2. External state management
3. Multiple hook instances

### `useMemo` in `useObjectFit`

The hook no longer uses `useMemo` internally, as it's now a pure computation. This is compatible with React Compiler which handles memoization automatically.

## Upgrade Path

1. **Update React**: Ensure you're on React 18.0.0 or higher
2. **Update imports**: Add new selective hooks if beneficial
3. **Remove deps arrays**: Refactor any usage of the removed `deps` parameter
4. **Test SSR**: Verify your SSR behavior with the new fallback values
5. **Test concurrent mode**: Enable concurrent features to verify no tearing

## Compatibility

| React Version | Hamo v1.x | Hamo v2.x |
|---------------|-----------|-----------|
| 17.x          | ✅        | ❌        |
| 18.x          | ✅        | ✅        |
| 19.x          | ✅        | ✅        |

## Questions?

Open an issue at https://github.com/darkroomengineering/hamo/issues
