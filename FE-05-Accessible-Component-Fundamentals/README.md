# Assignment FE-05: Accessible Component Fundamentals

This repository contains the completed implementation for **Assignment FE-05 – Accessible Component Fundamentals**.

The project demonstrates how to build fully accessible, keyboard-navigable UI components from scratch following the **W3C ARIA Authoring Practices Guide (APG)** patterns, alongside a side-by-side comparison with **shadcn/ui** (Radix UI) components.

---

## 1. What FE-05 Is

FE-05 is a React + TypeScript playground project focused on accessibility (a11y) fundamentals. It showcases:
- How to write custom interactive UI components (**Modal Dialog**, **Tabs**, **Disclosure**) from scratch without relying on component libraries.
- Strict compliance with W3C ARIA semantics, roles, attributes, and keyboard navigation specifications.
- Comparative analysis between manual implementations and production component libraries like Radix/shadcn UI.
- Comprehensive keyboard testing, focus trapping, and focus restoration verification.

---

## 2. What Was Implemented

### Manual Scratch Implementations (`src/playground/`)

1. **Modal Dialog (`Modal.tsx`)**:
   - **Semantics**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
   - **Portal Rendering**: Rendered at `document.body` level via `ReactDOM.createPortal`.
   - **Focus Trap**: Traps `Tab` and `Shift+Tab` cycling within the modal's focusable elements.
   - **Initial Focus**: Focuses a specified `initialFocusRef`, the first focusable element, or the modal container (`tabIndex={-1}`).
   - **Focus Restoration**: Remembers `document.activeElement` when opened and restores focus back to the trigger button upon close.
   - **Escape Key**: Pressing `Escape` closes the dialog.
   - **Background Lock**: Prevents background scrolling with `overflow: hidden` on `document.body`.

2. **Tabs Pattern (`Tabs.tsx`)**:
   - **Semantics**: `role="tablist"`, `role="tab"`, `role="tabpanel"`.
   - **Roving Tabindex**: Active tab receives `tabIndex={0}`; inactive tabs receive `tabIndex={-1}`.
   - **Keyboard Navigation**: `ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`, `Home`, and `End` move focus between tabs.
   - **Activation Modes**: Supports `automatic` (focusing tab selects it) and `manual` (requires `Enter` or `Space` to select).
   - **Orientation**: Supports `horizontal` and `vertical` orientations.
   - **ARIA Relationships**: Links `aria-controls` on tab triggers to `id` on corresponding tab panels.

3. **Disclosure Pattern (`Disclosure.tsx`)**:
   - **Semantics**: Native `<button type="button">` with `aria-expanded` and `aria-controls`.
   - **Keyboard Access**: Responds natively to `Enter` and `Space` key triggers.
   - **Content Binding**: Panel container has matching `id` and `hidden` attribute reflecting state.

### shadcn/ui Component Integration (`src/components/ui/`)

- Configured Radix UI primitives (`@radix-ui/react-dialog` and `@radix-ui/react-tabs`) in `src/components/ui/`.
- Provided side-by-side comparison in the playground UI.
- Documented key architectural differences in `NOTES.md`.

---

## 3. How to Install Dependencies

To set up the project and install all required packages:

```bash
# Navigate to the project directory
cd FE-05-Accessible-Component-Fundamentals

# Install dependencies
npm install
```

---

## 4. How to Run the Playground

To start the Vite development server and launch the interactive playground:

```bash
# Run local dev server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the playground.

To run typechecks and linting:

```bash
# Run TypeScript type validation
npm run lint
```

---

## 5. How Keyboard Testing Was Performed

Keyboard testing was conducted strictly using keyboard-only navigation (no mouse interactions) across all three components:

### Modal Dialog Keyboard Test Flow
1. **Triggering**: Navigated to the "Open Manual Modal" button using `Tab` and activated it with `Enter` / `Space`.
2. **Initial Focus Verification**: Verified that focus moved directly into the modal (either to the first text input or close button).
3. **Focus Trap Verification**: Pressed `Tab` repeatedly through all form fields and buttons inside the modal. Verified that pressing `Tab` on the final button wrapped focus back to the close button without escaping to the background web page.
4. **Shift + Tab Reverse Loop**: Pressed `Shift + Tab` from the close button and verified that focus wrapped back to the last button inside the modal.
5. **Escape Key Dismissal**: Pressed `Escape` while focused anywhere inside the dialog. Verified that the modal closed instantly.
6. **Focus Restoration**: Verified that focus returned precisely to the "Open Manual Modal" trigger button that launched the dialog.

### Tabs Component Keyboard Test Flow
1. **Initial Tab Focus**: Pressed `Tab` to enter the tab list. Verified that only the active tab received initial focus (`tabIndex=0`).
2. **Arrow Key Navigation**: Pressed `ArrowRight` and `ArrowLeft` to cycle focus across tabs. Verified that focus wrapped from the last tab to the first tab, skipping disabled tabs automatically.
3. **Home & End Keys**: Pressed `Home` to jump focus directly to the first enabled tab, and `End` to jump to the last enabled tab.
4. **Activation Modes**: Tested both `automatic` mode (focus change switches active panel) and `manual` mode (focusing tab requires `Enter` or `Space` to activate).

### Disclosure Component Keyboard Test Flow
1. **Focusing**: Pressed `Tab` to focus the disclosure header button. Verified that a visible focus indicator outline appeared around the button.
2. **Toggle Activation**: Pressed `Space` and `Enter` to expand and collapse the region. Verified that screen readers announce the updated `aria-expanded="true"` or `aria-expanded="false"` state.

---

## 6. Directory Structure

```
FE-05-Accessible-Component-Fundamentals/
├── package.json
├── .gitignore
├── README.md
├── NOTES.md
├── index.ts
└── src/
    ├── App.tsx
    ├── PlaygroundApp.tsx
    ├── types/
    │   └── index.ts
    ├── playground/
    │   ├── Modal.tsx
    │   ├── Tabs.tsx
    │   ├── Disclosure.tsx
    │   └── index.ts
    └── components/
        └── ui/
            ├── lib/
            │   └── utils.ts
            ├── dialog.tsx
            └── tabs.tsx
```
