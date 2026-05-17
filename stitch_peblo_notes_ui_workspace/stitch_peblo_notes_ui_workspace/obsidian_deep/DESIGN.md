---
name: Obsidian Deep
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3b3742'
  surface-container-lowest: '#0f0d15'
  surface-container-low: '#1d1a23'
  surface-container: '#211e27'
  surface-container-high: '#2c2832'
  surface-container-highest: '#37333d'
  on-surface: '#e7e0ed'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e7e0ed'
  inverse-on-surface: '#322f39'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ffb0cd'
  on-secondary: '#640039'
  secondary-container: '#aa0266'
  on-secondary-container: '#ffbad3'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cd'
  on-secondary-fixed: '#3e0022'
  on-secondary-fixed-variant: '#8c0053'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#15121b'
  on-background: '#e7e0ed'
  surface-variant: '#37333d'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  sidebar_width: 260px
  container_max: 1200px
---

## Brand & Style
The design system focuses on a high-end, developer-centric SaaS aesthetic that blends the structural efficiency of Linear with the collaborative depth of Notion. The interface is unapologetically dark, utilizing deep ink-tones and vibrant neon accents to create a sense of focused immersion.

The visual direction is **Modern / Minimalist** with a lean toward **Glassmorphism** for layered depth. It targets high-velocity teams and power users who value precision, speed, and visual clarity. The emotional response is one of calm, professional authority, where AI features feel integrated and sophisticated rather than gimmicky.

## Colors
The palette is built on a "Deep Night" foundation. The background scales from a pure base (`#0a0a0f`) to elevated surfaces to create natural hierarchy without relying on heavy shadows. 

**Accent Logic:**
- **Purple (#8b5cf6):** Primary actions, active states, and system-level notifications.
- **Pink (#ec4899):** Creative features and AI-assisted insights.
- **Cyan (#06b6d4):** Collaboration signals and live-presence indicators.
- **Gradients:** Use the 135-degree brand gradient sparingly for high-impact moments like "New Workspace" buttons or AI generation progress bars.

## Typography
The system uses **Inter** exclusively for UI and content to maintain a systematic, utilitarian feel. For code blocks or technical AI metadata, **JetBrains Mono** is introduced to provide a clear distinction.

- **Headlines:** Use tight letter-spacing (-0.02em) on larger sizes to maintain the "Linear" look.
- **Body:** Standardize on `body-md` for the majority of interface text to maximize information density.
- **Hierarchy:** Use weight (500-600) rather than color to differentiate between labels and secondary descriptions.

## Layout & Spacing
This design system utilizes a **Fixed-Fluid Hybrid** model. The sidebar is fixed at 260px, while the main editor/workspace area is fluid with a maximum readable width of 1200px.

**Grid & Rhythm:**
- A strict 4px baseline grid ensures vertical rhythm.
- **Margins:** 24px (lg) on desktop; 16px (md) on mobile.
- **Gutters:** 16px constant for grid-based dashboard views.
- **Mobile:** Sidebars transform into bottom-sheets or full-screen overlays to preserve horizontal real estate for the editor.

## Elevation & Depth
Depth is created through color stepping and subtle border luminescence rather than traditional heavy shadows.

- **Level 0 (Base):** `#0a0a0f` used for the main application background.
- **Level 1 (Surface):** `#111118` used for sidebars and secondary panels.
- **Level 2 (Elevated):** `#1a1a24` used for cards, modals, and popovers.
- **Hover State:** Elements should transition to `#22222e` with a `1px` upward translation (`translateY(-1px)`).
- **Glass Effect:** Use a `12px` backdrop-blur on top navigation bars and modal overlays to maintain context of the content beneath.

## Shapes
The shape language is **Soft** but disciplined. 
- **Small (4px):** Checkboxes, small tags, and nested list indicators.
- **Medium (8px):** Standard buttons, input fields, and sidebar items.
- **Large (12px):** Workspace cards, modals, and main editor containers.
- **Pill:** Reserved exclusively for status indicators (e.g., "AI Processing" or "Live") to distinguish them from actionable buttons.

## Components
- **Buttons:**
  - **Primary:** Brand gradient background, white text, 0.2s cubic-bezier transition.
  - **Secondary:** Subtle border (`rgba(255,255,255,0.08)`), transparent background, lightens on hover.
  - **Ghost:** No border/bg, becomes `#bg-hover` on hover.
- **Sidebar Items:**
  - **Active State:** Background is `purple/10%` (`rgba(139, 92, 246, 0.1)`), text is `#8b5cf6`, and a 2px vertical "active" bar on the left edge.
- **Inputs:**
  - Solid `#111118` background with a subtle border. On focus, the border transitions to `#primary_color` with a soft glow (box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2)).
- **Cards:**
  - Use `bg-elevated`. On hover, apply a `1px` border change to a slightly brighter white-alpha and a soft ambient shadow.
- **AI Tooltips:**
  - Distinctive pink/purple border-left (3px) to indicate AI-generated content or suggestions within the note flow.