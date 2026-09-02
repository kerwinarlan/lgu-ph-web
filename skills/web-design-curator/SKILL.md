---
name: web-design-curator
description: Research and curate top aesthetic, high-performance web UI design patterns, government design systems (Gov.uk, USWDS, DICT e-Gov), typography, and component layouts for web applications.
---

# Web Design Curator Protocol

Use this skill when researching, curating, and evaluating web UI designs, color palettes, component layouts, and design systems for web portals.

## Research & Curation Workflow

### 1. Identify Top Reference Design Systems
* **Government & Public Sector:** Inspect Gov.uk, US Web Design System (USWDS), and DICT e-Gov design standards.
* **Modern Component Systems:** Inspect Shadcn UI, Radix UI, Tailwind UI, and Carbon Design System for layout hierarchy and typography.
* **Key Focus:** Extract clean visual hierarchy, generous whitespace, sharp typography, and accessible color contrast.

### 2. Extract Design Tokens
* **Color Palette:**
  * Dominant Brand Primary (60%)
  * High-contrast Surface/Card Backgrounds (30%)
  * Vibrant Call-to-Action Accent (10%)
* **Typography Scale:** System-font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) for zero network font delay.
* **Spacing & Touch Targets:** 8px spacing grid; minimum 44x44px touch targets for mobile viewports.

### 3. Performance Budget Guardrails
* **Max Transfer Size:** Under 50 KB total for uncompressed static web assets (HTML, CSS, JS).
* **Speed Index:** Under 1.0s on 3G mobile network throttles.
* **Asset Rules:** Prefer crisp inline SVG vectors over heavy PNG/JPEG raster images; avoid external web font network requests.

### 4. Accessibility & Environmental Checks
* **Outdoor Visibility:** Verify minimum 4.5:1 contrast ratio under direct sunlight.
* **Keyboard & Screen Reader Support:** Require visible focus rings, aria labels, and semantic HTML tags.
