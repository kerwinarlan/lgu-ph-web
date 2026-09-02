---
name: ui-accessibility-review
description: Accessibility and UI review protocol for LGU portals. Use when evaluating mobile responsiveness, contrast ratios, WCAG 2.1 AA compliance, and ARTA/DILG layout standards.
---

# LGU UI & Accessibility Review Protocol

Use this skill when auditing frontend user interfaces for compliance and accessibility.

## Review Criteria

### 1. WCAG 2.1 AA Accessibility
* Text elements must maintain a minimum 4.5:1 color contrast ratio.
* Form fields and search bars must include clear `<label>` or `aria-label` attributes.
* Keyboard navigation must work for table filters and menu links.

### 2. Mobile Responsiveness
* Verify layouts at 360px viewport width.
* Tables must scroll horizontally without breaking screen boundaries.
* Touch targets must measure at least 44x44 pixels.

### 3. Government Branding
* Ensure prominent display of LGU classification and official seal.
* Display ARTA Citizen's Charter and DILG FDP sections clearly.
