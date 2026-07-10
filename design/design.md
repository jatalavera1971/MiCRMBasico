---
version: "1.0"
name: CRM-Emerald-Design-System
description: A professional CRM design system synthesized from Apple's minimalism (single-accent restraint, negative-tracking Inter typography), Tesla's engineering precision (radical whitespace, zero decorative chrome, functional-only shadow), and Starbucks' warmth (multi-layer soft shadows on cards, warm stone canvas instead of cold white). The sole brand accent is Emerald Moderno (#1A7A52) — a confident mid-dark green that reads as professional and modern without shouting. Every decision filters through the question: "Does this make the CRM feel calm, authoritative, and immediately legible?" Pipeline stages and priorities are coded in color pairs (bg + text) so Carlos reads status before reading the name.

colors:
  primary: "#1A7A52"
  primary-hover: "#156645"
  primary-active: "#105238"
  primary-on: "#ffffff"
  primary-50: "#E8F5EF"
  primary-100: "#C8E9D8"
  primary-200: "#9DD4BB"
  primary-300: "#6BBF9D"
  primary-400: "#3DAA80"
  primary-500: "#1A7A52"
  primary-600: "#156645"
  primary-700: "#105238"
  primary-800: "#0B3E2B"
  primary-900: "#072B1E"

  canvas: "#FAFAF9"
  surface: "#ffffff"
  surface-subtle: "#F5F4F2"
  surface-muted: "#EFEDEB"
  surface-sidebar: "#072B1E"
  surface-sidebar-active: "rgba(255,255,255,0.12)"
  surface-sidebar-hover: "rgba(255,255,255,0.06)"

  ink: "#1C1917"
  ink-secondary: "#57534E"
  ink-muted: "#A8A29E"
  ink-disabled: "#D6D3D1"
  ink-on-dark: "#ffffff"
  ink-on-dark-soft: "rgba(255,255,255,0.70)"
  ink-brand: "#1A7A52"

  border: "#E7E5E4"
  border-strong: "#D6D3D1"
  border-brand: "#1A7A52"
  border-focus-ring: "#9DD4BB"

  success: "#16A34A"
  success-bg: "#F0FDF4"
  success-border: "#86EFAC"
  success-text: "#166534"

  warning: "#D97706"
  warning-bg: "#FFFBEB"
  warning-border: "#FCD34D"
  warning-text: "#92400E"

  error: "#DC2626"
  error-bg: "#FEF2F2"
  error-border: "#FECACA"
  error-text: "#991B1B"

  info: "#2563EB"
  info-bg: "#EFF6FF"
  info-border: "#BFDBFE"
  info-text: "#1E40AF"

  pipeline-lead-bg: "#DBEAFE"
  pipeline-lead-text: "#1D4ED8"
  pipeline-interested-bg: "#EDE9FE"
  pipeline-interested-text: "#5B21B6"
  pipeline-quote-bg: "#FEF3C7"
  pipeline-quote-text: "#B45309"
  pipeline-won-bg: "#DCFCE7"
  pipeline-won-text: "#15803D"
  pipeline-inactive-bg: "#F3F4F6"
  pipeline-inactive-text: "#6B7280"
  pipeline-lost-bg: "#FEE2E2"
  pipeline-lost-text: "#B91C1C"

  priority-high-bg: "#FEE2E2"
  priority-high-text: "#B91C1C"
  priority-medium-bg: "#FEF3C7"
  priority-medium-text: "#B45309"
  priority-low-bg: "#DCFCE7"
  priority-low-text: "#15803D"

  risk-bg: "#FFF5F5"
  risk-border: "#FECACA"

typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.03em
  heading-xl:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.025em
  heading-lg:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  heading-md:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  heading-sm:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.015em
  data-value:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.025em
  body-lg:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.01em
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.01em
  body-strong:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: -0.01em
  body-sm:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.01em
  body-sm-strong:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: -0.01em
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em
  caption:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  overline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0.06em
  badge:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0.04em
  button-sm:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  button-md:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.01em
  button-lg:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.01em
  nav-item:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.01em

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  pill: 9999px
  full: 50%

spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  mobile-padding: 16px
  card-padding: 16px
  card-padding-lg: 24px
  section-gap: 24px
  inline-gap: 8px
  list-item-gap: 12px

components:
  btn-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: 9px 18px
    transition: "background 0.15s ease"
  btn-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-on}"
  btn-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.primary-on}"
    transform: scale(0.98)
  btn-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: 9px 18px
  btn-secondary-hover:
    backgroundColor: "{colors.surface-subtle}"
    borderColor: "{colors.border-strong}"
  btn-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-brand}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: 9px 18px
  btn-ghost-hover:
    backgroundColor: "{colors.primary-50}"
  btn-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.primary-on}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: 9px 18px
  btn-sm:
    padding: 6px 14px
    rounded: "{rounded.md}"
    typography: "{typography.button-sm}"
  btn-lg:
    padding: 12px 24px
    rounded: "{rounded.lg}"
    typography: "{typography.button-lg}"
  btn-disabled:
    opacity: 0.45
    cursor: not-allowed

  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    placeholderColor: "{colors.ink-muted}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 9px 12px
    height: 40px
  input-focus:
    borderColor: "{colors.border-brand}"
    borderWidth: 2px
    boxShadow: "0 0 0 3px rgba(157,212,187,0.40)"
    outline: none
  input-error:
    borderColor: "{colors.error}"
    backgroundColor: "{colors.error-bg}"
  input-disabled:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink-disabled}"
    opacity: 0.65
    cursor: not-allowed
  input-search:
    backgroundColor: "{colors.surface-subtle}"
    borderColor: "{colors.border}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px

  badge-base:
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
    textTransform: uppercase
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success-text}"
    borderColor: "{colors.success-border}"
    borderWidth: 1px
  badge-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning-text}"
    borderColor: "{colors.warning-border}"
    borderWidth: 1px
  badge-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error-text}"
    borderColor: "{colors.error-border}"
    borderWidth: 1px
  badge-neutral:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink-secondary}"
    borderColor: "{colors.border}"
    borderWidth: 1px
  badge-brand:
    backgroundColor: "{colors.primary-50}"
    textColor: "{colors.ink-brand}"
    borderColor: "{colors.primary-200}"
    borderWidth: 1px
  badge-pipeline-lead:
    backgroundColor: "{colors.pipeline-lead-bg}"
    textColor: "{colors.pipeline-lead-text}"
  badge-pipeline-interested:
    backgroundColor: "{colors.pipeline-interested-bg}"
    textColor: "{colors.pipeline-interested-text}"
  badge-pipeline-quote:
    backgroundColor: "{colors.pipeline-quote-bg}"
    textColor: "{colors.pipeline-quote-text}"
  badge-pipeline-won:
    backgroundColor: "{colors.pipeline-won-bg}"
    textColor: "{colors.pipeline-won-text}"
  badge-pipeline-inactive:
    backgroundColor: "{colors.pipeline-inactive-bg}"
    textColor: "{colors.pipeline-inactive-text}"
  badge-pipeline-lost:
    backgroundColor: "{colors.pipeline-lost-bg}"
    textColor: "{colors.pipeline-lost-text}"
  badge-priority-high:
    backgroundColor: "{colors.priority-high-bg}"
    textColor: "{colors.priority-high-text}"
  badge-priority-medium:
    backgroundColor: "{colors.priority-medium-bg}"
    textColor: "{colors.priority-medium-text}"
  badge-priority-low:
    backgroundColor: "{colors.priority-low-bg}"
    textColor: "{colors.priority-low-text}"

  card-default:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 16px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
  card-default-hover:
    boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)"
  card-metric:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 20px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
    height: 80px
  card-contact:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 16px
    height: 64px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
  card-contact-hover:
    backgroundColor: "{colors.primary-50}"
    borderColor: "{colors.primary-200}"
    boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)"
  card-contact-risk:
    backgroundColor: "{colors.risk-bg}"
    borderColor: "{colors.risk-border}"
  card-pipeline:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 12px 14px
    width: 224px
    height: 84px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
  card-pipeline-risk:
    backgroundColor: "{colors.risk-bg}"
    borderColor: "{colors.risk-border}"
  card-task:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 14px 16px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
  card-task-overdue:
    backgroundColor: "{colors.risk-bg}"
    borderColor: "{colors.risk-border}"

  sidebar:
    backgroundColor: "{colors.surface-sidebar}"
    width: 240px
    padding: 16px 12px
  nav-item-default:
    backgroundColor: transparent
    textColor: "{colors.ink-on-dark-soft}"
    typography: "{typography.nav-item}"
    rounded: "{rounded.md}"
    padding: 9px 12px
  nav-item-active:
    backgroundColor: "{colors.surface-sidebar-active}"
    textColor: "{colors.ink-on-dark}"
    borderLeft: "3px solid {colors.primary-300}"
  nav-item-hover:
    backgroundColor: "{colors.surface-sidebar-hover}"
    textColor: "{colors.ink-on-dark}"
  top-nav:
    backgroundColor: "{colors.surface}"
    borderBottom: "1px solid {colors.border}"
    height: 64px
    padding: 0 24px
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
  bottom-nav-mobile:
    backgroundColor: "{colors.surface}"
    borderTop: "1px solid {colors.border}"
    height: 60px
    position: fixed

  table-header-cell:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.overline}"
    padding: 12px 16px
    borderBottom: "1px solid {colors.border}"
  table-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 14px 16px
    borderBottom: "1px solid {colors.border}"
  table-row-hover:
    backgroundColor: "{colors.primary-50}"

  avatar-xs:
    size: 24px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    fontSize: 10px
    fontWeight: 600
  avatar-sm:
    size: 32px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    fontSize: 12px
    fontWeight: 600
  avatar-md:
    size: 40px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    fontSize: 14px
    fontWeight: 600
  avatar-lg:
    size: 48px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    fontSize: 16px
    fontWeight: 600
  avatar-xl:
    size: 64px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    fontSize: 20px
    fontWeight: 600

  alert-success:
    backgroundColor: "{colors.success-bg}"
    borderColor: "{colors.success-border}"
    borderWidth: 1px
    textColor: "{colors.success-text}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-warning:
    backgroundColor: "{colors.warning-bg}"
    borderColor: "{colors.warning-border}"
    borderWidth: 1px
    textColor: "{colors.warning-text}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-error:
    backgroundColor: "{colors.error-bg}"
    borderColor: "{colors.error-border}"
    borderWidth: 1px
    textColor: "{colors.error-text}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-info:
    backgroundColor: "{colors.info-bg}"
    borderColor: "{colors.info-border}"
    borderWidth: 1px
    textColor: "{colors.info-text}"
    rounded: "{rounded.lg}"
    padding: 16px

  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    boxShadow: "0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)"
    maxWidth: 480px
    padding: 20px 24px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    borderRadiusTop: 24px
    boxShadow: "0 -10px 25px rgba(0,0,0,0.12)"
    padding: 16px 20px
  overlay-backdrop:
    backgroundColor: "rgba(0,0,0,0.40)"

  interaction-card:
    backgroundColor: "{colors.surface}"
    borderLeft: "3px solid [channel-color]"
    borderRadius: "0 12px 12px 0"
    borderOther: "1px solid {colors.border}"
    padding: 14px 16px
    boxShadow: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
  next-step-block:
    backgroundColor: "{colors.primary-50}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    textColor: "{colors.success-text}"
  alert-banner:
    backgroundColor: "{colors.warning-bg}"
    borderColor: "{colors.warning-border}"
    borderWidth: 1px
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 14px
---

## Overview

This CRM Design System is built for **daily professional use** — a CRM where Carlos (a sales rep) and Marta (a small business owner) spend hours every day managing contacts, pipeline, and tasks. Every visual decision serves legibility and calm, not novelty.

The system draws three principles from its references:

1. **From Apple** — A single brand accent (`{colors.primary}`, Emerald Moderno #1A7A52) carries every interactive element. No second chromatic color competes with it. Typography uses Inter with Apple-tight negative letter-spacing at display sizes, creating a confident, editorial feel. `transform: scale(0.98)` is the universal button press state.

2. **From Tesla** — Decoration earns its place. No gradients, no decorative shadows, no borders on cards that can be separated by whitespace alone. The sidebar is the one dark-surface element in the system, using the deepest emerald (`{colors.surface-sidebar}` — #072B1E) to create a gallery-like frame around the working canvas, mirroring Tesla's frosted-glass nav floating over the content.

3. **From Starbucks** — The canvas is warm (`{colors.canvas}` — #FAFAF9, a stone off-white), not cold hospital white. Cards use a two-layer soft shadow stack (`0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)`) and a `1px solid {colors.border}` border — the Starbucks-style whisper-lift that separates without declaring. The color-block section rhythm (canvas → surface cards → dark sidebar) provides depth without borders or gradients.

**Key Characteristics:**
- Emerald Moderno (`{colors.primary}` — #1A7A52): the only chromatic color in the interface. All CTAs, active states, focus rings, nav accents. One accent, absolute.
- Warm stone canvas (`{colors.canvas}` — #FAFAF9) with pure white cards (`{colors.surface}` — #ffffff) — the same "warm canvas under white cards" depth trick Starbucks uses.
- Inter at negative letter-spacing (`-0.01em` to `-0.03em`) — the Apple tight-headline feel applied to a cross-platform open font.
- `{rounded.lg}` (12px) for cards and primary buttons. `{rounded.md}` (8px) for inputs. `{rounded.pill}` (9999px) for badges and avatar circles only — no pill buttons in the CRM (precision over friendliness).
- Two-layer shadow stack (`{component.card-default}`) on all cards — Starbucks-style ambient + direct lighting simulation. No single heavy drop-shadow.
- Dark emerald sidebar (`{colors.surface-sidebar}` — #072B1E) as the only dark surface. The nav floats like Tesla's transparent nav over the white content area.
- Pipeline stages and priorities encoded as color pairs (`bg + text`), always uppercase 11px — Carlos reads urgency before reading the name.

## Colors

> **Source design systems analyzed:** Apple.com (single-accent, near-black/white/parchment, no gradients), Tesla.com (monochrome + one blue, near-zero decoration, white canvas), Starbucks.com (four-tier green system, warm cream canvas, multi-layer shadows). Synthesized for a professional CRM with Emerald Moderno as the sole brand green.

### Primary — Emerald Moderno

- **Primary** (`{colors.primary}` — #1A7A52): The sole interactive-color signal. Every CTA button, active nav item, focus ring, and link. Chosen for its balance between authority (dark enough to feel enterprise) and energy (saturated enough to feel modern). Never used decoratively — only functional.
- **Primary Hover** (`{colors.primary-hover}` — #156645): Applied on button hover. Darkens by one step — the same micro-shift Tesla uses on their Electric Blue CTAs.
- **Primary Active** (`{colors.primary-active}` — #105238): Applied on button press alongside `scale(0.98)`. The Apple active-state pattern.
- **Primary On** (`{colors.primary-on}` — #ffffff): Text/icon color on top of any emerald surface.

### Emerald Scale (50–900)

| Token | Hex | Use |
|---|---|---|
| `{colors.primary-50}` | #E8F5EF | Card hover backgrounds, badge backgrounds, next-step blocks |
| `{colors.primary-100}` | #C8E9D8 | Avatar background fill, focus ring tint |
| `{colors.primary-200}` | #9DD4BB | Focus ring border, badge border accent |
| `{colors.primary-300}` | #6BBF9D | Active nav indicator stripe |
| `{colors.primary-400}` | #3DAA80 | — intermediate scale |
| `{colors.primary-500}` | #1A7A52 | ★ Primary — same as `{colors.primary}` |
| `{colors.primary-600}` | #156645 | Hover state |
| `{colors.primary-700}` | #105238 | Active/pressed state, avatar text on light fill |
| `{colors.primary-800}` | #0B3E2B | — deep scale |
| `{colors.primary-900}` | #072B1E | Sidebar background (`{colors.surface-sidebar}`) |

### Canvas & Surfaces

- **Canvas** (`{colors.canvas}` — #FAFAF9): The page background — warm stone, not cold white. The same philosophy as Starbucks' `#f2f0eb`, but lighter for a SaaS/digital context. Surface cards appear to float on this warm base.
- **Surface** (`{colors.surface}` — #ffffff): Cards, inputs, dropdowns, modals. Pure white only here — the contrast with the canvas is what creates elevation without shadows.
- **Surface Subtle** (`{colors.surface-subtle}` — #F5F4F2): Table headers, alternate row backgrounds, input disabled fill. One step warmer than canvas.
- **Surface Muted** (`{colors.surface-muted}` — #EFEDEB): Background for muted chips, neutral badges. Two steps warmer.
- **Surface Sidebar** (`{colors.surface-sidebar}` — #072B1E): The deepest emerald — near black with a green undertone. Used only for the sidebar. Inspired by Tesla's true-black global nav and Apple's near-black tile system: the dark surface frames the content area like a gallery wall.

### Text — Warm Stone

- **Ink** (`{colors.ink}` — #1C1917): Primary text. All names, key data, headings. A warm near-black (stone-900) — not pure black, keeping the page feeling like a crafted product, not a printed document. Apple uses the same strategy with their `#1d1d1f`.
- **Ink Secondary** (`{colors.ink-secondary}` — #57534E): Body text for activities, subtitles, metadata.
- **Ink Muted** (`{colors.ink-muted}` — #A8A29E): Timestamps, placeholders, disabled labels.
- **Ink Disabled** (`{colors.ink-disabled}` — #D6D3D1): Disabled input text.
- **Ink On Dark** (`{colors.ink-on-dark}` — #ffffff): All text on the dark sidebar.
- **Ink On Dark Soft** (`{colors.ink-on-dark-soft}` — rgba(255,255,255,0.70)): Inactive nav items on the sidebar — Starbucks uses the same 70% alpha for secondary text on dark green surfaces.

### Semantic Colors

Success, Warning, Error, and Info follow the same pattern: a `bg` (light tint), `border` (mid-tone), and `text` (dark readable tone). The Starbucks pattern of stacking two transparent layers (tinted bg + colored border) instead of one opaque fill.

| State | bg | border | text |
|---|---|---|---|
| Success | `{colors.success-bg}` #F0FDF4 | `{colors.success-border}` #86EFAC | `{colors.success-text}` #166534 |
| Warning | `{colors.warning-bg}` #FFFBEB | `{colors.warning-border}` #FCD34D | `{colors.warning-text}` #92400E |
| Error | `{colors.error-bg}` #FEF2F2 | `{colors.error-border}` #FECACA | `{colors.error-text}` #991B1B |
| Info | `{colors.info-bg}` #EFF6FF | `{colors.info-border}` #BFDBFE | `{colors.info-text}` #1E40AF |

### Pipeline & Priority Color Pairs

CRM-specific. Carlos scans these colors hundreds of times per day. Always applied as `bg + text` pairs. Never one without the other. Always uppercase 11px/500 badge.

| Stage | bg | text |
|---|---|---|
| Lead | `{colors.pipeline-lead-bg}` #DBEAFE | `{colors.pipeline-lead-text}` #1D4ED8 |
| Interesado | `{colors.pipeline-interested-bg}` #EDE9FE | `{colors.pipeline-interested-text}` #5B21B6 |
| Presupuesto | `{colors.pipeline-quote-bg}` #FEF3C7 | `{colors.pipeline-quote-text}` #B45309 |
| Ganado ★ | `{colors.pipeline-won-bg}` #DCFCE7 | `{colors.pipeline-won-text}` #15803D |
| Inactivo | `{colors.pipeline-inactive-bg}` #F3F4F6 | `{colors.pipeline-inactive-text}` #6B7280 |
| Perdido | `{colors.pipeline-lost-bg}` #FEE2E2 | `{colors.pipeline-lost-text}` #B91C1C |

**Risk signal** (`{colors.risk-bg}` #FFF5F5 + `{colors.risk-border}` #FECACA): Applied universally to any overdue or at-risk element — Task Card vencida, Pipeline Card +7 días sin contacto. Carlos recognizes this signal without reading text.

### No Gradient Policy

Following both Apple and Tesla: **no decorative gradients anywhere**. Surface depth comes from (a) the canvas vs. surface color contrast, (b) multi-layer soft shadows on cards, (c) the dark sidebar as a framing device. Gradients in button backgrounds, section headers, or decorative elements are prohibited.

## Typography

### Font Family

**Inter** (Google Fonts, variable weight) — the closest open-source equivalent to SF Pro that Apple uses. Applied with `font-feature-settings: "cv05"` for the single-story `a`. Anti-aliased: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`.

```
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Unlike SF Pro (macOS/iOS-only) or Universal Sans (Tesla's custom font), Inter is freely available and renders consistently across all platforms — critical for a web-based CRM.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display}` | 48px | 600 | 1.1 | -0.03em | Hero KPIs, onboarding headlines |
| `{typography.heading-xl}` | 36px | 600 | 1.15 | -0.025em | Page-level section titles |
| `{typography.heading-lg}` | 30px | 600 | 1.2 | -0.02em | Dashboard section headers |
| `{typography.heading-md}` | 24px | 600 | 1.3 | -0.02em | Panel headings, modal titles |
| `{typography.heading-sm}` | 20px | 600 | 1.4 | -0.015em | Card headings, sidebar group labels |
| `{typography.data-value}` | 32px | 700 | 1.1 | -0.025em | KPI numbers on metric cards |
| `{typography.body-lg}` | 18px | 400 | 1.6 | -0.01em | Onboarding descriptions, empty state text |
| `{typography.body}` | 16px | 400 | 1.6 | -0.01em | Default paragraph copy |
| `{typography.body-strong}` | 16px | 600 | 1.6 | -0.01em | Inline emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.55 | -0.01em | **The most-used text style in the app** — table rows, list items, form values |
| `{typography.body-sm-strong}` | 14px | 500 | 1.55 | -0.01em | Contact name in list items, button labels |
| `{typography.label}` | 14px | 500 | 1.4 | -0.01em | Input labels, section labels |
| `{typography.caption}` | 12px | 400 | 1.5 | 0 | Timestamps, secondary metadata, footnotes |
| `{typography.overline}` | 11px | 600 | 1.0 | 0.06em | Table column headers — UPPERCASE |
| `{typography.badge}` | 11px | 500 | 1.0 | 0.04em | All badge/pill labels — UPPERCASE |
| `{typography.button-sm}` | 13px | 500 | 1.0 | 0 | Small buttons |
| `{typography.button-md}` | 14px | 500 | 1.0 | -0.01em | Default buttons |
| `{typography.button-lg}` | 15px | 500 | 1.0 | -0.01em | Large buttons, primary CTAs |
| `{typography.nav-item}` | 14px | 500 | 1.0 | -0.01em | Sidebar navigation items |

### Principles

- **Negative letter-spacing at display sizes.** Every size from 14px upward carries negative tracking (`-0.01em` to `-0.03em`). Produces the "Inter tight" headline feel. Never used on 11px badge text.
- **Weight ladder is 400 / 500 / 600 / 700.** No weight 300 (not needed in a data-dense CRM). No weight 800+. Each step has a clear semantic role.
- **Body text at 14px, not 16px.** The CRM displays dense tables and list items — 14px is the minimum for comfortable scanning. Descriptive text rises to 16px.
- **Sentence case throughout.** All buttons, headings, and body copy. UPPERCASE reserved only for `{typography.overline}` and `{typography.badge}`.

**Real hierarchy example — contact list row:**
```
Ana García                  ← body-sm-strong 14px/500 ink
Llamada · hace 2 días       ← caption 12px/400 ink-muted
INTERESADO                  ← badge 11px/500 pipeline-interested-text UPPERCASE
```

## Layout

### Spacing System

**Base unit: 4px.** Structural layout snaps to multiples of 4. The most frequent values are 8px (inline gaps) and 16px (card padding, mobile margin).

| Token | Value | Alias / Common Use |
|---|---|---|
| `{spacing.1}` | 4px | Tightest inline gap between related elements |
| `{spacing.2}` | 8px | Icon-label gap (`{spacing.inline-gap}`), badge internal padding |
| `{spacing.3}` | 12px | List item gap (`{spacing.list-item-gap}`), small component padding |
| `{spacing.4}` | **16px** | ★ Card padding (`{spacing.card-padding}`), mobile screen margin (`{spacing.mobile-padding}`) |
| `{spacing.5}` | 20px | Medium card content padding |
| `{spacing.6}` | 24px | Section gap (`{spacing.section-gap}`), large card padding (`{spacing.card-padding-lg}`) |
| `{spacing.8}` | 32px | Large section separation |
| `{spacing.10}` | 40px | — |
| `{spacing.12}` | 48px | — |
| `{spacing.16}` | 64px | Top navigation height, desktop-scale section padding |
| `{spacing.20}` | 80px | — |

**Universal rhythm:** 16px appears on every page as mobile margin, card padding, and the most-used structural gap. The system is anchored to this constant.

### Grid & Container

- **Mobile viewport target:** 390px (iPhone 14/15). Content area: `390px - 32px margin = 358px`.
- **Tablet breakpoint:** 768px — sidebar appears, bottom nav disappears.
- **Desktop max content width:** 1280px, centered.
- **Card grid:** 3-column on desktop (metric cards), 1-column on mobile (list items).
- **Kanban column:** fixed 240px per column, horizontal scroll.
- **Sidebar:** 240px fixed, content area takes remaining width.

### Whitespace Philosophy

Following Tesla's gallery principle: whitespace communicates "this matters." Each list item is separated by 8px — enough air to be distinct, not enough to feel sparse. Section gaps (24px) separate conceptual groups. The canvas background (`{colors.canvas}`) is the "air" that makes white cards float. Never fill space just because it's available.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Sidebar, top nav, full-bleed sections |
| Card rest | `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` + `1px solid {colors.border}` | All cards in default state |
| Card hover | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Hovered cards, open dropdowns |
| Modal / Sheet | `0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)` | Bottom sheets, centered modals |
| Popover / Menu | `0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)` | Context menus, popovers, tooltips |

**Shadow philosophy.** Following Starbucks' multi-layer approach: every shadow is two layers — one tight high-alpha (simulates direct light) and one diffuse low-alpha (simulates ambient). This creates a physically plausible lift without a single heavy drop-shadow that reads as a CSS shortcut. Apple's philosophy of reserving elevation for functional purpose (not decoration) applies: cards get shadows because they need to appear above the canvas; decorative elements get none.

**Depth without shadows:** The dark sidebar (`{colors.surface-sidebar}`) creates depth through color contrast alone — the same strategy Apple uses for alternating dark tiles on their homepage. The canvas-to-surface color step (warm off-white → pure white) provides the first level of perceived depth before any shadow is needed.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Table edges, full-width banners, dividers |
| `{rounded.xs}` | 4px | Inline code chips, tooltips, tight internal elements |
| `{rounded.sm}` | 6px | Small secondary buttons, compact chips |
| `{rounded.md}` | 8px | **Inputs, selects, small buttons** — the precision radius (Tesla influence: sharp enough to feel engineered) |
| `{rounded.lg}` | 12px | **★ Cards, primary buttons, modals** — the standard card radius |
| `{rounded.xl}` | 16px | Large modals, bottom sheet top radius on mobile |
| `{rounded.2xl}` | 24px | Bottom sheet top radius (only the top-two corners) |
| `{rounded.pill}` | 9999px | **Badges, tags, avatar circles, search input** — never on primary buttons |
| `{rounded.full}` | 50% | Circular avatars, notification dots |

**No pill buttons.** Unlike Apple (pill CTAs) and Starbucks (50px pill buttons), this CRM uses `{rounded.lg}` (12px) for primary buttons. In an enterprise tool, a slightly squared button reads as more precise and professional. Pills are reserved for badges and search — elements that need to feel "lightweight" or "filterlike."

## Components

### Buttons

**`{component.btn-primary}`** — The only filled-color CTA. Background `{colors.primary}` (#1A7A52), text `{colors.primary-on}`, `{rounded.lg}` (12px radius), padding 9px × 18px. The 12px radius sits between Tesla's 4px (too sharp for a CRM) and Apple's full pill (too casual for enterprise). Active: `transform: scale(0.98)` + `{colors.primary-active}` background — Apple's system-wide micro-interaction applied.
- Hover: `{component.btn-primary-hover}` — background shifts to `{colors.primary-hover}` (#156645).
- Disabled: `{component.btn-disabled}` — `opacity: 0.45; cursor: not-allowed`.

**`{component.btn-secondary}`** — Paired with primary for cancel/alternative actions. Background `{colors.surface}` (white), text `{colors.ink}`, `1px solid {colors.border}`. Same radius and padding as primary. Hover: background shifts to `{colors.surface-subtle}`, border to `{colors.border-strong}`.

**`{component.btn-ghost}`** — Used inside cards and tables for inline actions ("Editar", "Ver detalle"). Background transparent, text `{colors.ink-brand}` (emerald). Hover: background `{colors.primary-50}`. No border — less visual noise in dense table rows.

**`{component.btn-destructive}`** — Delete and irreversible actions only. Background `{colors.error}` (#DC2626). Same geometry as primary. Never in a row with another primary button — one primary action per screen.

**Size variants:**
- `{component.btn-sm}` — 13px, padding 6px × 14px, radius `{rounded.md}` (8px). For table actions, compact cards.
- `{component.btn-md}` — Default. 14px, padding 9px × 18px.
- `{component.btn-lg}` — 15px, padding 12px × 24px. For primary page CTAs.

### Inputs & Forms

**`{component.input-default}`** — Background white, `1px solid {colors.border}`, `{rounded.md}` (8px), height 40px, padding 9px × 12px, `{typography.body-sm}`. The 8px radius is deliberately more precise than the 12px card radius — inputs are data-entry tools, not containers.

**`{component.input-focus}`** — Border upgrades to `2px solid {colors.border-brand}` + `box-shadow: 0 0 0 3px rgba(157,212,187,0.40)` (a soft emerald glow from `{colors.primary-200}`). The focus ring is visible but not alarming — the Starbucks "springy but calm" focus philosophy.

**`{component.input-search}`** — Uses `{rounded.pill}` to visually distinguish it as a filtering/search tool, not a form input. Background `{colors.surface-subtle}`, no hard border — the softened version for search contexts.

Always include a visible `<label>`. Placeholder text is supplementary, never the primary label. Error messages explain and propose a solution — never blame the user.

### Badges / Pills

**`{component.badge-base}`** — Universal base: `{typography.badge}` (11px/500), `{rounded.pill}`, padding 3px × 10px, `text-transform: uppercase`. Always apply as a `bg + text` pair from the color tokens. Never one without the other.

Pipeline and priority badges are the visual language Carlos reads at a glance. The badge for **Ganado** (`{component.badge-pipeline-won}`) uses emerald tones — the brand's "success" color signal — reinforcing the emotional connection between winning a deal and the brand identity.

### Cards

**`{component.card-default}`** — The universal container. White surface on canvas, `1px solid {colors.border}`, `{rounded.lg}` (12px), two-layer shadow (`0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)`), padding 16px. Hover: shadow lifts to the `card-default-hover` level. This is the Starbucks card formula — layered soft lift, never a single heavy shadow.

**`{component.card-metric}`** — Fixed height 80px. Contains: icon container (40×40px colored square with 10px radius) + KPI number in `{typography.data-value}` (32px/700) + label in `{typography.caption}`. Three per row on desktop (grid, 10px gap), stacked on mobile.

**`{component.card-contact}`** — Fixed height 64px. The atomic unit of the CRM contact list. Anatomy: `[Avatar 40px] — [Name + Activity row] — [Pipeline badge + Chevron]`. The priority badge always appears **before** the name — Carlos reads urgency before identity. Hover: `{component.card-contact-hover}` — background shifts to `{colors.primary-50}`, border to `{colors.primary-200}`. Risk state: `{component.card-contact-risk}` — same warm red signal as task and pipeline risk.

**`{component.card-pipeline}`** — Kanban card. Fixed 224×84px. Contains priority badge + name (top row) + pipeline stage badge + last-contact date (bottom row). Risk variant: `{component.card-pipeline-risk}` — same `{colors.risk-bg}` / `{colors.risk-border}` pair used consistently across the system.

**`{component.card-task}`** — Anatomy: `[Checkbox 20px] — [Title + Date] — [Done button sm]`. Overdue variant (`{component.card-task-overdue}`) uses the risk signal. The "Done" button is deliberately small (ghost sm) to separate two tap targets: the whole card navigates to the contact, the button completes the task.

### Navigation

**`{component.sidebar}`** — Fixed-position left column, 240px wide. Background `{colors.surface-sidebar}` (#072B1E — the deepest emerald, near black). The dark sidebar frames the white content area — a Tesla-inspired gallery effect where the "chrome" recedes and the content takes over.

**`{component.nav-item-default}`** — 14px/500, `{colors.ink-on-dark-soft}` (70% white). Subtle, quiet — inactive items don't compete. `{rounded.md}` (8px), padding 9px × 12px.

**`{component.nav-item-active}`** — Background `{colors.surface-sidebar-active}` (rgba white 12%), text `{colors.ink-on-dark}` (100% white), and a `3px solid {colors.primary-300}` left border stripe. The stripe is the only chromatic accent in the dark sidebar — a thin line of mid-emerald connecting the active item to the brand color.

**`{component.top-nav}`** — 64px, white background, bottom border, subtle shadow. Contains: search input (`{component.input-search}`), notifications icon, user avatar. This is the desktop counterpart.

**`{component.bottom-nav-mobile}`** — 60px, fixed to viewport bottom, white background with top border. Three tabs: Inicio · Clientes · Pipeline. Active icon fills with `{colors.primary}`. Minimum tap target: 44×44px per tab.

### Avatars

All avatars use `{rounded.full}` (50%) for a perfect circle. Default background: `{colors.primary-100}` (mint). Default text: `{colors.primary-700}` (dark emerald). Two initials maximum from full name, uppercase.

Sizes: xs (24px) · sm (32px) · md (40px — default) · lg (48px) · xl (64px).

### Alerts

Four variants following the semantic color system. Each contains: icon (16px) + title (14px/600) + description (14px/400) + optional close button. Inline in the page flow — no toast-style absolute positioning unless specified.

**Alert banner** (`{component.alert-banner}`) — A special 48px inline banner for the "N clientes sin contacto en +7 días" warning. When condition is false, the component does not exist in the DOM — no `display: none`, no reserved space.

### Modals & Sheets

**`{component.modal}`** — Desktop centered modal. 480px max-width, `{rounded.xl}` (16px), xl shadow. Entry: `scale(0.96) + opacity(0) → scale(1) + opacity(1)` at 150ms ease-out. Exit: reverse at 100ms ease-in.

**`{component.bottom-sheet}`** — Mobile modal. Slides up from bottom: `translateY(100%) → translateY(0)` at 150ms ease-out. Top border-radius 24px. Always includes: drag handle (36×4px, `{colors.border-strong}`, pill radius) + header + scrollable body + fixed footer (Cancelar + Guardar). Footer always visible.

### Interaction Card

**`{component.interaction-card}`** — Activity history items. A `3px solid [channel-color]` left border encodes the communication channel at a glance — Carlos scans channel color before reading content. Right radius: `0 12px 12px 0` (no left radius, so the border flush-aligns). Channel colors: Llamada `#3B82F6`, WhatsApp `#25D366`, Email `{colors.ink-muted}`.

**`{component.next-step-block}`** — Embedded inside interaction cards when a next action exists. Background `{colors.primary-50}`, 8px radius, check-circle icon in `{colors.success}` + "PRÓXIMO PASO" overline label + action text. **Never rendered when empty** — the block does not exist in the DOM if there's no next step.

## Do's and Don'ts

### Do
- Use `{colors.primary}` (#1A7A52) for every interactive element — CTAs, active nav, focus rings, links. The single-accent rule (Apple / Tesla) is non-negotiable.
- Set display headlines in `{typography.heading-md}` or larger with negative letter-spacing. Set body in `{typography.body-sm}` at 14px — never below 12px.
- Use `{rounded.lg}` (12px) for cards and primary buttons. Use `{rounded.md}` (8px) for inputs. Use `{rounded.pill}` only for badges and search inputs.
- Apply the two-layer shadow stack (`{component.card-default}`) to all cards. Stack two low-alpha layers, never one heavy drop-shadow.
- Use `{colors.canvas}` (#FAFAF9) for the page background and `{colors.surface}` (#ffffff) only for cards. Never the reverse.
- Apply `transform: scale(0.98)` as the press state on all buttons.
- Use the pipeline and priority color pairs (§ Colors section) for all badge status indicators. Always uppercase 11px.
- Render conditional components (alert banner, next-step block) only when their condition is true — remove them from the DOM when false.

### Don't
- Don't introduce a second chromatic accent. The entire interface has one color: `{colors.primary}`. Semantic colors (error, warning, info) are states, not accents.
- Don't use gradients anywhere — not on buttons, backgrounds, cards, or decorative elements.
- Don't apply heavy single-layer drop-shadows. The system uses two-layer soft stacks only.
- Don't use `{rounded.pill}` on primary buttons — the 12px card radius is the button radius.
- Don't use pure white `#ffffff` for the page canvas — it's reserved for `{colors.surface}` (cards). The canvas is always `{colors.canvas}` (#FAFAF9).
- Don't use `display: none` to hide conditional components — remove them from the DOM entirely.
- Don't add decorative borders to the sidebar or navigation — separation is achieved by the dark/light surface contrast.
- Don't mix pipeline badge colors arbitrarily — the color pairs (bg + text) are fixed and semantic.
- Don't place a priority badge after the contact name — it always leads.
- Don't make the "Done" button on task cards large — it must be smaller than the card's navigation target.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Bottom nav replaces sidebar; single-column layouts; 16px screen margin; cards full-width |
| Tablet | 768–1024px | Sidebar appears (240px); top nav replaces bottom nav; 2-column grids begin |
| Desktop | 1024–1280px | Full layout; 3-column metric grids; sidebar + top nav; table view for contacts |
| Wide | > 1280px | Content locks at 1280px; sidebar and top nav stay fixed |

### Touch Targets
- Minimum 44×44px. All list items meet this by their 64px height and full-width tap area.
- Buttons at sm size (6px × 14px padding + 13px font) land at ~30px height — on mobile, add bottom padding or use md size.
- The "Done" button in task cards is deliberately below full 44px — its tap area is narrow by design (two-target pattern).
- Bottom nav tabs: each tab is 60px tall × one-third viewport width — well above 44px.

### Collapsing Strategy
- **Navigation**: Sidebar (240px) on ≥768px → bottom nav (60px fixed) on mobile.
- **Metric cards**: 3-column grid on desktop → 1-column stacked on mobile.
- **Contact table**: Full table on desktop → card list on mobile.
- **Kanban**: Horizontal scroll column grid on desktop → single-column card list on mobile (grouped by stage).
- **Modals**: Centered `{component.modal}` on desktop → `{component.bottom-sheet}` on mobile.

### Animation

- **Enter**: 150ms ease-out (`--easing-enter`).
- **Exit**: 100ms ease-in (`--easing-exit`).
- **Hover transitions**: 150ms ease on background, border-color, box-shadow.
- **Button press**: `transform: scale(0.98)` — instantaneous.
- No bounce, spring, or decorative looping animations. Tesla's 0.33s transitions informed the spirit but the CRM prefers 150ms for perceived speed.

## CRM-Specific Patterns

### Risk Signal — Transversal Consistency

The pair `{colors.risk-bg}` (#FFF5F5) + `{colors.risk-border}` (#FECACA) appears on:
- `{component.card-task-overdue}` — task past due date
- `{component.card-pipeline-risk}` — deal with no contact in 7+ days
- `{component.card-contact-risk}` — contact flagged as at-risk

Carlos and Marta recognize this signal across every screen without reading text. It is the only alarm signal — never used decoratively.

### Two-Target Cards

When a card both navigates (tapping the card body) and contains a secondary action (a button within), apply:
- Secondary button is always ghost sm — visually subordinate.
- `e.stopPropagation()` on the button click.
- The button is never wider than needed — its tap area is deliberately smaller than the card body.

### Copywriting Standards

- Segunda persona informal (tú). Sentence case always. Badges: UPPERCASE.
- CTAs: verb + object — "Guardar cambios", "Ver todos los clientes".
- Dates < 7 days: relative ("hace 2 días"). Dates ≥ 7 days: absolute short ("lunes 23 jun").
- Amounts: € prefix, period as thousands separator ("€2.400").
- Errors: explain cause and propose solution — never blame ("Este campo es obligatorio" → "Añade el nombre del cliente para continuar").
- Empty states: descriptive + propositional ("Aún no tienes clientes aquí · Empieza añadiendo tu primer cliente").

## Iteration Guide

1. Focus on **one component** at a time. Reference its token key directly (`{component.card-contact}`, `{component.btn-primary}`).
2. Use `{token.refs}` everywhere — never inline hex values in component code.
3. The single-accent rule: if an element needs visual emphasis, use whitespace or surface-color change before reaching for a new color.
4. Badge colors are not configurable — the pipeline and priority color pairs are fixed semantic signals.
5. The risk signal (`{colors.risk-bg}` + `{colors.risk-border}`) is applied consistently — never change it per-component.
6. When in doubt about border-radius: `{rounded.lg}` (12px) for containers, `{rounded.md}` (8px) for inputs, `{rounded.pill}` for badges.
7. Never document hover separately as a state — only default, active/pressed, disabled, and error.

## Known Gaps

- Dark mode tokens are not defined in v1.0 — the warm stone canvas system is designed for light mode. Dark mode requires a parallel token set where `{colors.canvas}` and `{colors.surface}` invert.
- Form validation animations (success checkmark, error shake) are not tokenized — behavior only, handled at implementation level.
- The interaction-card channel colors (Llamada, WhatsApp, Email) are hard-coded values, not tokens — they will be promoted to tokens in v1.1 when a third channel is added.
- Drag-and-drop kanban column reordering behavior is not specified — component spec covers the card visuals only.
- Print/export styles are not covered.
- The `{component.interaction-card}` uses `[channel-color]` as a placeholder — implementation selects from the three defined channel hex values.
