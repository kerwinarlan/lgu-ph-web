---
name: e2e-citizen-test
description: E2E citizen testing protocol for LGU web portals. Use when simulating citizen user journeys on mobile viewports to verify service searches, document downloads, and emergency hotline access.
---

# E2E Citizen User Testing Protocol

Use this skill to simulate citizen interactions and test deployment integrity.

## Core User Journeys

### Journey 1: Emergency Assistance
1. Citizen opens portal on mobile phone.
2. Citizen navigates to Emergency Hotlines.
3. Verify MDRRMO and Police telephone numbers are visible immediately without scrolling.

### Journey 2: Permit Inquiry (ARTA Charter)
1. Citizen types "business" or "tax" into search input.
2. Verify matching municipal services filter instantly.
3. Verify processing time, required documents, and fees display accurately.

### Journey 3: Financial Transparency (DILG FDP)
1. Citizen scrolls to DILG FDP section.
2. Citizen checks quarterly budget and procurement listings.
3. Verify PDF download links open correctly in new tab.
