# FRCPath Part 2 Microbiology Revision App - Design Guidelines

## Design Approach: Material Design System
**Rationale:** Educational productivity app requiring clear information hierarchy, excellent readability for long-form medical content, and professional appearance suitable for medical professionals preparing for examinations.

**Key Design Principles:**
- Clinical Clarity: Clean, distraction-free layouts prioritizing content comprehension
- Professional Authority: Medical-grade visual treatment inspiring confidence
- Study Ergonomics: Design optimized for extended reading and revision sessions
- Focused Learning: Minimal decorative elements, maximum functional value

---

## Core Design Elements

### A. Color Palette

**Primary Colors (Dark Mode - Default):**
- Background: 220 15% 12% (deep navy-charcoal)
- Surface: 220 13% 18% (elevated cards/panels)
- Primary Accent: 210 100% 60% (medical blue - trust and clarity)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary Accent: 210 85% 50%
- Text Primary: 220 20% 15%
- Text Secondary: 220 15% 45%

**Functional Colors:**
- Audio Active: 160 70% 45% (teal green - playing state)
- PDF Highlight: 45 95% 60% (amber - annotations)
- Progress: 210 100% 60% (matches primary)

### B. Typography

**Font Family:**
- Primary: 'Inter' (Google Fonts) - exceptional readability for medical terminology
- Monospace: 'JetBrains Mono' (for chemical formulas, code snippets if needed)

**Scale:**
- Display (H1): text-3xl md:text-4xl font-bold
- Section Headers (H2): text-2xl font-semibold
- Topic Titles (H3): text-xl font-medium
- Body Text: text-base leading-relaxed (optimized for PDF reading)
- Metadata: text-sm text-secondary
- Audio Duration: text-xs font-mono

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12, 16, 24
- Component padding: p-4 md:p-8
- Section spacing: space-y-8
- Card gaps: gap-4
- List item spacing: space-y-2

**Grid Structure:**
- Contents sidebar: w-80 (fixed width on desktop)
- Main content: flex-1 (responsive)
- Mobile: Full-width stack, sidebar as drawer

### D. Component Library

**1. Navigation Sidebar**
- Collapsible topic categories with nested subtopics
- Active state: Blue left border (border-l-4) + blue background tint
- Search/filter bar at top for quick topic access
- Progress indicators showing completed topics (checkmarks)
- Sticky positioning with scroll overflow

**2. Topic Content Viewer**
- PDF embed container: Minimal chrome, full-width rendering
- Floating audio player: Sticky bottom bar (bottom-0 z-50)
- Controls: Play/pause, progress bar, time display, speed control (0.75x, 1x, 1.25x, 1.5x)
- Waveform visualization (optional): Subtle animated bars during playback

**3. Audio Player Component**
- Persistent bottom bar (h-20): Survives navigation between topics
- Background playback indicator: Small icon showing playing status
- Mini player: Topic title, play/pause, skip 15s back/forward
- Expanded player (click to open): Full controls, playlist, volume

**4. Cards & Lists**
- Topic cards: Rounded-lg with subtle shadow and hover lift effect
- List items: Clean dividers, clear touch targets (min-h-12)
- Icon treatment: Medical-themed icons (Heroicons) - document, audio, bookmark

**5. Interactions**
- Page transitions: Smooth 200ms ease-out
- Audio feedback: Visual state changes (no sound effects)
- Loading states: Skeleton screens for PDF loading
- Error states: Friendly messages with retry actions

---

## Screen-Specific Guidelines

### Home/Contents Screen
**Layout:** Two-column desktop (sidebar + main), single-column mobile
- Left sidebar: Collapsible category tree with all topics
- Main area: Featured topics, recently accessed, progress dashboard
- Quick stats card: Topics completed, hours studied, streaks

### Topic Detail Screen
**Layout:** Full-width PDF viewer + sticky audio bar
- Header: Topic title, breadcrumb navigation, bookmark toggle
- PDF viewer: Embedded iframe or canvas renderer, full viewport height
- Audio player: Sticky bottom, always accessible
- Mobile: Swipe between PDF and audio controls tab

### Audio Player (Expanded)
- Large album art placeholder (microorganism illustrations if available)
- Prominent play/pause button (size: w-16 h-16)
- Scrubbing timeline with timestamp markers
- Playlist: Other topic audios for queue

---

## Accessibility & Performance

- Minimum contrast ratio: 4.5:1 for all text
- Touch targets: Minimum 44px × 44px
- Keyboard navigation: Full support with visible focus states
- PDF lazy loading: Load on-demand, cache aggressively
- Audio preloading: Next topic audio preloads in background
- Offline support: Service worker for cached PDFs and audio

---

## Images & Media

**Images:** Minimal use
- App icon: Microscope or microbiology-themed illustration
- Empty states: Simple medical illustrations for "no content" states
- No hero image (utility app focused on content)

**Audio Visualization:**
- Animated waveform bars during playback (optional enhancement)
- Static waveform preview on topic cards

---

## Information Architecture

**Primary Navigation:** Sidebar topic tree
**Secondary Navigation:** Breadcrumbs within topics
**Tertiary:** Audio playlist/queue management

This design creates a focused, professional study environment optimized for medical professionals mastering complex microbiology content.