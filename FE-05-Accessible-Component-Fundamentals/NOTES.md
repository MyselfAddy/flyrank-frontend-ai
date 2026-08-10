# FE-05: Accessible Component Fundamentals – Architectural Analysis

This document summarizes our manual W3C ARIA Authoring Practices (APG) component implementations and highlights concrete architectural differences when compared to production primitives like **shadcn/ui** (built on **Radix UI**).

---

## 1. What We Implemented

In `src/playground/`, three fundamental accessible components were implemented from scratch:

1. **Modal Dialog (`Modal.tsx`)**:
   - Renders via `ReactDOM.createPortal` attached to `document.body`.
   - Manages focus trap using custom `KeyDown` listeners for `Tab` and `Shift+Tab`.
   - Captures `document.activeElement` prior to opening and restores focus to the trigger upon closing.
   - Listens for the `Escape` key on `window` to trigger closure.
   - Applies `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.

2. **Tabs (`Tabs.tsx`)**:
   - Implements `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
   - Uses roving `tabindex` (`tabIndex={0}` for active tab, `tabIndex={-1}` for inactive tabs).
   - Handles `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, and `End` keys to navigate across enabled tabs.
   - Links tab buttons and tab panels via dynamic `id`, `aria-controls`, and `aria-labelledby` attributes.

3. **Disclosure (`Disclosure.tsx`)**:
   - Uses a standard `<button type="button">` trigger.
   - Manages state via `aria-expanded` (`true`/`false`).
   - Links trigger to content using `aria-controls`.

---

## 2. Two Concrete Implementation Gaps

When comparing our manual components against the installed Radix UI primitives (`@radix-ui/react-dialog` and `@radix-ui/react-tabs` used in `src/components/ui/`):

### Gap 1: Dedicated Focus Scope Primitive vs. Custom Focus Trap Handler
- **Manual (`Modal.tsx`)**: Queries DOM focusable selectors manually (`button`, `input`, `a[href]`, etc.) inside an event handler and intercepts `Tab` / `Shift+Tab` keydowns to loop focus.
- **Radix Dialog (`@radix-ui/react-dialog`)**: Encapsulates focus management within a dedicated `FocusScope` primitive that handles automatic initial focus, focus trapping, and focus restoration declaratively, isolating focus lifecycle logic from the dialog markup.

### Gap 2: Built-in Directional & Navigation Abstractions in Tabs
- **Manual (`Tabs.tsx`)**: Manually maps key events in component state code to cycle indices and updates focus state directly via ref-based element focusing.
- **Radix Tabs (`@radix-ui/react-tabs`)**: Abstracted keyboard navigation into the primitive level, supporting directional awareness (`dir="ltr" | "rtl"`), automatic vs. manual activation modes, and standardized focus cycling out of the box without manual event handling.

---

## 3. Key Takeaways

1. **Core Semantics Are Universal**: Standard ARIA attributes (`role`, `aria-expanded`, `aria-controls`, `aria-modal`, roving `tabindex`) are identical regardless of whether built manually or with a library.
2. **Primitive Encapsulation Reduces Boilerplate**: Production libraries like Radix UI isolate complex behavior (focus trapping, portal management, directionality) into composable primitives, leaving styling and presentation to wrapper frameworks like shadcn/ui.

