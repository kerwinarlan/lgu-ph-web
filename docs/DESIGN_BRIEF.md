# Web Design Brief & Aesthetic Guide: Tanza LGU Digital Portal

> **Author**: Web Design Trends & Aesthetic Specialist Agent  
> **Target**: `/Users/kerwinarlan/github/lgu-ph-web` (Municipality of Tanza, Cavite)  
> **Date**: September 2025  
> **Status**: Approved Design System Specification for Web Development Agent Execution

---

## 1. Study Time Budget & Research Synthesis

### Allotted Study Time Computation
* **Scope Level**: Level 2/3 (Page & Portal Homepage System)
* **Target Sections**: 7 Sections (Header/GovBar, Emergency Ticker, Mayor Hero + Stats, Core Bento Services, BAC Procurement, ARTA Charter Search, DILG FDP Portal)
* **Formula**: `Study Time (mins) = Base Time (3 mins) + (7 Sections × 1.5 mins) + (Motion Complexity Factor 2.0 mins)`
* **Computed Study Budget**: **15.5 Minutes**

### Trend & Aesthetic Findings (2025–2026 Web Design Paradigms)
1. **Glassmorphism & Depth Elevation**: Modern civic portals move away from flat 2010s blocks toward clean surface layering. A 1px translucent border (`rgba(255, 255, 255, 0.1)` or `rgba(15, 23, 42, 0.08)`), combined with subtle `backdrop-filter: blur(12px)` and multi-stage drop shadows (`0 4px 20px -2px rgba(15,23,42,0.06)`), creates authoritative visual polish without slowing down render times.
2. **Asymmetrical Bento Grid**: Rather than uniform list columns, public services are arranged in a 3-column Bento layout where focal actions (e.g., Business Permits, Emergency Hotlines) take 2-column or full spans with high-contrast badge accents.
3. **Fluid Clamp Typography**: Replaces fixed pixel headings with responsive `clamp()` formulas, ensuring crisp typography across 320px mobile viewports up to 4K displays without layout jumps.
4. **Tactile Micro-Interactions**: Hover states use standard Apple-ease transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) with `translateY(-3px)` lift and active button scale compress (`scale(0.98)`).
5. **Interactive Drawers & Modals**: Complex data (e.g., ARTA application steps, required documents) is offloaded into fluid slide-over drawers/modals, keeping the main feed clean and fast.

---

## 2. Full CSS Design Tokens (`:root`)

```css
:root {
  /* Brand & Palette (Deep Navy / Sky Slate / Warm Gold Accent) */
  --color-primary-dark: #0f172a;       /* Slate 900 - Primary Backgrounds / Header */
  --color-primary: #1e3a8a;            /* Blue 900 - Brand Civic Anchor */
  --color-primary-light: #3b82f6;      /* Blue 500 - Interactive Highlights */
  --color-accent: #f59e0b;             /* Amber 500 - Gold Heritage & CTA Accent */
  --color-accent-hover: #d97706;       /* Amber 600 - Pressed Gold Accent */
  
  /* Status & Severity Colors */
  --color-emergency: #dc2626;          /* Red 600 - 24/7 Sticky Ticker & Hotlines */
  --color-success: #16a34a;            /* Green 600 - Simple ARTA / Active Badges */
  --color-warning: #ea580c;            /* Orange 600 - Complex ARTA Badges */
  --color-info: #0284c7;               /* Sky 600 - Technical / Notice Badges */

  /* Neutral Surface Layers */
  --bg-page: #f8fafc;                  /* Slate 50 - Main Page Background */
  --bg-card: #ffffff;                  /* Pure White - Primary Containers */
  --bg-card-alt: #f1f5f9;              /* Slate 100 - Secondary Inputs & Tables */
  --bg-glass: rgba(15, 23, 42, 0.85);  /* Translucent Dark Glass Header */
  
  /* Typography & Text Contrast */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --text-main: #0f172a;                /* High Contrast Text (Slate 900) */
  --text-muted: #64748b;               /* Secondary Subtitles (Slate 500) */
  --text-inverse: #ffffff;             /* Light Text for Dark Banners */
  
  /* Fluid Clamp Typography Scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --text-2xl: clamp(2.25rem, 1.8rem + 1.8vw, 3.5rem);

  /* Layout Elevation & Borders */
  --border-light: rgba(15, 23, 42, 0.08);
  --border-focus: rgba(59, 130, 246, 0.5);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Elevation Shadows */
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06);

  /* Motion Timing & Curves */
  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-fast: 150ms var(--ease-apple);
  --transition-normal: 250ms var(--ease-apple);
  --transition-slow: 400ms var(--ease-apple);
}
```

---

## 3. ASCII Element Blocking Layout

```
===================================================================================
 [01] TOP GOV BAR (PST Time | Republic Badge | High-Contrast Mode Toggle)
===================================================================================
 [02] GLASSMORPHIC HEADER (LGU Title, Cavite Province Badge, PSGC Code)
===================================================================================
 [03] STICKY EMERGENCY TICKER (24/7 Red Alert Pulse | Quick Hotline Pills | Copy)
===================================================================================
 [04] PRIMARY NAV (Executive | Core Services | BAC Bids | Emergency | ARTA | FDP)
===================================================================================

 [05] EXECUTIVE HERO SECTION (Asymmetrical Grid)
 +---------------------------------------------------+ +--------------------------+
 | MAYOR'S EXECUTIVE MESSAGE CARD                    | | QUICK STATS BENTO GRID   |
 | - Gold Accent Badge: "Serbisyo sa Mamamayan"      | | +----------------------+ |
 | - Mayor Avatar + Quote in Editorial Serif/Sans     | | | 339,308 Pop.         | |
 | - "Hon. Archangelo B. Matro" Signature Badge     | | +----------------------+ |
 |                                                   | | | 1st Class | 41 Brgy | |
 +---------------------------------------------------+ +--------------------------+

===================================================================================
 [06] CORE PUBLIC SERVICES BENTO GRID (3-Column Asymmetrical)
 +-------------------------------+ +-------------------------------+ +------------+
 | 🏢 Business Permits (BPLO)    | | 📜 Real Property Tax (RPT)    | | 🏥 Health  |
 | Span: 1 Column | Accent Gold  | | Span: 1 Column               | | Span: 1 Col|
 +-------------------------------+ +-------------------------------+ +------------+
 +--------------------------------------------------------------------------------+
 | 📢 BAC PROCUREMENT & BIDDING NOTICES (Span: 3 Columns / Full Highlight)        |
 | Active Invitations to Bid | Infrastructure | School Rehab | Medical Supplies  |
 +--------------------------------------------------------------------------------+

===================================================================================
 [07] DUAL-COLUMN UTILITY SECTION
 +---------------------------------------------------+ +--------------------------+
 | 🚨 24/7 EMERGENCY DIRECTORY                       | | 📰 PUBLIC ADVISORIES   |
 | - MDRRMO, PNP, BFP, MHO Cards                     | | - Weather Advisories   |
 | - 1-Tap Call & Copy Phone Buttons                 | | - Traffic & Events     |
 +---------------------------------------------------+ +--------------------------+

===================================================================================
 [08] ARTA CITIZEN'S CHARTER (RA 11032) SEARCH & INTERACTIVE MODAL TABLE
 - Live Instant Search Filter [ Search service, office, or code... ]
 - Interactive Table Rows -> Opens Modal Drawer with Documents & Step-by-Step
===================================================================================
 [09] DILG FULL DISCLOSURE POLICY (FDP) TRANSPARENCY PORTAL
 - Filter Pills: [ All ] [ Executive Budget ] [ SEF ] [ Procurement ] [ 20% DF ]
 - Instant Filterable Table + PDF Download Actions
===================================================================================
 [10] FOOTER (Official Seals | Compliance Statements | Copyright)
===================================================================================
```

---

## 4. Component & Typography Specifications

### 4.1 Navigation & Header
* **Glassmorphism Spec**: `background: var(--bg-glass); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1);`.
* **Brand Logo Badge**: Gold badge with text `GOV.PH` (`background: var(--color-accent); color: var(--color-primary-dark); font-weight: 800; border-radius: var(--radius-sm); padding: 2px 8px;`).

### 4.2 Emergency Hotline Bar
* **Behavior**: Sticky at `top: 0` during scroll (`z-index: 1000`).
* **Visual Style**: Deep crimson background (`background: #991b1b; color: #ffffff;`).
* **Action Pill**: `background: rgba(255,255,255,0.15); border-radius: var(--radius-full); padding: 4px 12px; transition: var(--transition-fast);`. Hover: `background: rgba(255,255,255,0.3); transform: scale(1.02);`.

### 4.3 Bento Grid Service Cards
* **Card Surface**: `background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 1.5rem; transition: var(--transition-normal);`.
* **Hover Elevation**: `transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: rgba(59,130,246,0.3);`.
* **Primary Accent Card (BAC Notices)**: Left border stripe `border-left: 4px solid var(--color-accent); background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);`.

### 4.4 Data Tables & Interactive Modal
* **Header Style**: `background: var(--color-primary-dark); color: var(--text-inverse); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em;`.
* **Interactive Rows**: `cursor: pointer; transition: var(--transition-fast);`. Hover: `background: #f1f5f9;`.
* **Classification Badges**:
  * *Simple*: `background: #dcfce7; color: #15803d; border-radius: var(--radius-full); padding: 2px 10px; font-weight: 600;`
  * *Complex*: `background: #ffedd5; color: #c2410c;`
  * *Highly Technical*: `background: #e0f2fe; color: #0369a1;`

---

## 5. Animation & Micro-Interaction Directives

1. **Card Lift**: All `.action-card`, `.stat-card`, `.emergency-item` elements feature `transition: transform 200ms var(--ease-apple), box-shadow 200ms var(--ease-apple)`.
2. **Tab Indicator Sliding**: FDP filter buttons feature smooth background pills (`background: var(--color-primary); color: #fff`) with `transition: all 200ms var(--ease-apple)`.
3. **Modal Overlay Fade & Scale**:
   * Backdrop: `opacity: 0 -> 1` (`transition: opacity 250ms ease`).
   * Drawer Container: `transform: translateY(20px) scale(0.97) -> translateY(0) scale(1.0)` (`transition: transform 300ms var(--ease-apple)`).
4. **Toast Notification**: Toast slides up from bottom right (`transform: translateY(100%) -> translateY(0)`) with 3-second auto-dismiss timer.

---

## 6. Developer Acceptance Checklist

The web development agent (`worker`) must verify all 10 criteria before completing the redesign:

- [ ] **1. Design Tokens Applied**: All hardcoded colors replaced with CSS variables (`var(--color-primary)`, `var(--color-accent)`, etc.) in `css/style.css`.
- [ ] **2. Glassmorphism Nav Implemented**: Header features translucent backdrop blur (`backdrop-filter: blur(12px)`).
- [ ] **3. Sticky Emergency Bar**: Emergency ticker stays pinned at the top on desktop and mobile viewports with quick copy actions.
- [ ] **4. Asymmetrical Bento Layout**: Services section renders in a clean 3-column responsive Bento Grid.
- [ ] **5. Mayor Hero Refined**: Message from Mayor displays in an executive editorial card with quick stat badges.
- [ ] **6. Interactive ARTA Modal**: Clicking any Citizen's Charter row opens a modal detailing requirements and step-by-step procedures.
- [ ] **7. Tabbed FDP Transparency Portal**: Category tabs filter financial documents instantly without page reloads.
- [ ] **8. Touch Targets & A11y**: All buttons and call actions maintain a minimum `44px × 44px` touch target.
- [ ] **9. Fast Mobile Responsiveness**: Fluid clamp typography scales seamlessly from 320px to 2560px with zero horizontal scrollbar.
- [ ] **10. Zero Validator Errors**: `python3 scripts/validate_data.py` passes 100%.

---

*Approved by Web Design Trends & Aesthetic Specialist Agent.*
