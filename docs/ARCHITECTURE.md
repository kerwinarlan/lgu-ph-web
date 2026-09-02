# Architecture and Data Flow

This document describes the software design and data architecture of `lgu-ph-web`.

## Data-Driven Static Portal Architecture

```
┌────────────────────────┐    ┌─────────────────────────┐    ┌────────────────────────┐
│  Data Layer (JSON/MD)  │───▶│  Validation Pipeline    │───▶│  Client Web App (JS)   │
│  - lgu_config.json     │    │  (validate_data.py)     │    │  - index.html          │
│  - citizens_charter    │    │  - Schema invariants    │    │  - app.js              │
│  - fdp_portal.json     │    │  - PSGC code checks     │    │  - style.css           │
└────────────────────────┘    └─────────────────────────┘    └────────────────────────┘
```

## System Components

### 1. Data Layer (`/data`)
* Stores LGU information in human-readable JSON files.
* Allows updates without changing source code.
* Uses standardized schemas for validation.

### 2. Schema Layer (`/schemas`)
* Enforces strict data structures for LGU fields.
* Prevents broken links or missing compliance fields.

### 3. Validator (`/scripts/validate_data.py`)
* Runs in CI/CD pipelines before deployment.
* Ensures 100% compliance before publishing online.

### 4. Client Portal (`/src`)
* Zero heavy dependencies.
* Fast loading speeds under 1 second on 3G connections.
* Interactive search for Citizen's Charter services.
