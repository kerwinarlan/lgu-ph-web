---
name: security-audit
description: Security audit protocol for LGU web portals. Use when inspecting HTML, JS, JSON schemas, or HTTP deployment configurations for XSS, unsanitized innerHTML, link safety, and security headers.
---

# LGU Security Audit Protocol

Use this skill when auditing security posture for government portal assets.

## Audit Checklist

### 1. Cross-Site Scripting (XSS)
* Check `app.js` and dynamic DOM rendering.
* Ensure text input uses `textContent` or sanitized templates instead of raw `innerHTML`.

### 2. External Link Safety
* Verify all external links use `rel="noopener noreferrer"`.
* Ensure PDF download links point to verified domain paths.

### 3. Content Security Policy (CSP) & Headers
* Enforce HTTPS-only traffic.
* Prevent iframe clickjacking with `X-Frame-Options: SAMEORIGIN`.
* Enforce strict MIME-type sniffing protection.
