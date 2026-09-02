# LGU PH Web Agent Guidelines

This document defines agent roles and review protocols for `lgu-ph-web`.

## 1. Role Evaluation and Selection

We maintain only high-value, minimal agent roles:

* **Security Auditor:** ACTIVE. Checks input sanitization, XSS prevention, security headers, and PDF link safety.
* **Senior UI/UX Reviewer:** ACTIVE. Verifies WCAG 2.1 AA accessibility, mobile responsiveness, and ARTA/DILG layout standards.
* **Core Web Engineer (JS/TS):** ACTIVE. Maintains client scripts, search indexing, schema validation, and fast DOM rendering.
* **E2E Citizen Tester:** ACTIVE. Tests citizen user journeys on mobile viewports (finding services, searching FDP files, dialing hotlines).
* **Accountant:** OMITTED. Unnecessary overhead for a static government portal repository.
* **VFX/Heavy Asset Agent:** OMITTED. High-res videos and heavy assets degrade page speed on rural 3G mobile networks.

## 2. Agent Execution Rules

* Keep all assets lightweight and mobile-first.
* Validate all JSON updates against schemas before committing.
* Ensure all pages load under 1 second on mobile connections.
* Maintain strict compliance with DILG Full Disclosure Policy and ARTA Citizen's Charter.
