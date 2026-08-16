# FE-AA1: Buttons with a Brain — Motion & State Micro-interactions

A production-grade, accessible AI Send / Action button built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Motion** (`motion/react`).

Demonstrating state-machine micro-interactions, spring physics, compositor-optimized properties, and full accessibility support for AI chat and generation actions.

---

## 🧠 Core Component: `BrainButton`

The `BrainButton` manages a deterministic finite state machine with smooth micro-interactions:

1. **`idle`**: Default ready state with subtle hover lighting and fast spring scale.
2. **`hover / focus`**: Tactile scale response (`1.02`), ambient border highlight, and clear `:focus-visible` ring.
3. **`loading`**: Replaces the label with a smooth slide & cross-fade (`AnimatePresence mode="popLayout"`), renders a spinning indicator, sets `aria-busy="true"`, and locks input to prevent spam-clicking race conditions.
4. **`success`**: Morph transition into a checkmark, brief green ambient glow, and an intentional cognitive dwell moment (~650ms) before returning automatically to `idle`.
5. **`error`**: Single-cycle controlled horizontal shake, ruby/rose border accent, and transforms the primary action into a **"Retry"** button. Clicking Retry re-executes the async operation.
6. **`disabled`**: Sets `aria-disabled="true"`, opacity reduction, `cursor-not-allowed`, and completely disables pointer events and scale animations.

---

## ⏱️ Motion System & Easing Rationale

### 1. Hover & Press Timing (120–180ms)
- **Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out curve).
- **Rationale**: Immediate tactile feedback without perceptible lag. Pressing scales slightly down to `0.97` to simulate physical resistance.

### 2. State Transitions (200–300ms)
- **Cross-Fade & Vertical Pop-Layout**: Content transitions with `opacity: 0 → 1` and `y: 8px → 0px`.
- **Zero Layout Thrashing**: Buttons maintain structured minimum heights and flexible inline bounds so surrounding layout elements never jitter or jump.

### 3. Success Dwell Moment (500–700ms)
- **Rationale**: Humans require approximately 400–600ms to visually register state resolution. Transitioning instantly back to idle causes confusion; lingering too long causes sluggishness. 650–700ms strikes the optimal balance.

### 4. Error Shake (350–380ms)
- **Keyframes**: `x: [0, -7, 7, -5, 5, -2, 2, 0]` with `easeInOut`.
- **Rationale**: A single decaying oscillation communicates a failure event without feeling chaotic or jarring.

### 5. Compositor-Only Properties
All motion choreography exclusively mutates GPU-compositor properties:
- `transform` (`scale`, `translate3d`, `rotate`)
- `opacity`
- `filter`

**Why?** Unlike `width`, `height`, `margin`, or `padding`, compositor properties do not trigger expensive browser reflows (Layout / Paint), guaranteeing 60/120fps smooth performance even on low-power mobile devices.

---

## ♿ Accessibility & Reduced Motion

- **Real `<button>` Element**: Built on native semantic HTML `<button>`.
- **Keyboard Usable**: Standard `Space` and `Enter` activation with high-contrast `:focus-visible` offset rings.
- **ARIA Attributes**: Dynamic `aria-busy`, `aria-live="polite"`, `aria-disabled`, and state-aware `aria-label`.
- **`prefers-reduced-motion`**:
  - Automatically detected via `useReducedMotion()` from `motion/react`.
  - When reduced motion is requested, rotational animations and horizontal shake keyframes are removed.
  - State changes are communicated crisply using instant color shifts, static icons, and clean text labels without sudden vestibular motion.

---

## 🧪 Testing & Verification

### Vitest Unit & Component Tests
```bash
npm test
```
Tests verify:
- Initial idle render and accessibility attributes.
- Click transition to loading and anti-spam lock.
- Success resolution and automatic timed reset to idle.
- Error state transition, shake, and retry execution.
- Disabled state enforcement.
- Deterministic `forceOutcome="success"` and `forceOutcome="error"`.
- Reduced-motion mode stability.

### Playwright E2E Tests
```bash
npm run test:e2e
```
Playwright verifies full browser interaction in Chromium, including deterministic force success/failure triggers, latency adjustment, and chat composer integration.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linter
npm run lint

# Build for production
npm run build
```
