<div align="center">

# 🇵🇭 LGU PH Web

**Standardized, lightweight digital portal framework for Philippine Local Government Units**

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-22c55e?logo=github)](https://kerwinarlan.github.io/lgu-ph-web/)
[![CI/CD](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/deploy.yml)

</div>

`lgu-ph-web` provides a fast web portal framework for Philippine Local Government Units (LGUs).
It simplifies public service publishing for Barangays, Municipalities, Cities, and Provinces.
The framework enforces DILG Full Disclosure Policy and ARTA Citizen's Charter compliance.

---

## Live Demo

Live GitHub Pages site: **[https://kerwinarlan.github.io/lgu-ph-web/](https://kerwinarlan.github.io/lgu-ph-web/)**

Reference LGU layout benchmarked against Tanza Municipality, Cavite (Region IV-A).

## Why it exists: LGU portals need speed and compliance

Many Philippine LGU websites suffer from heavy page loads and broken compliance links.
Small municipal teams often lack dedicated web developers or large IT budgets.
`lgu-ph-web` solves these issues with a data-driven static portal architecture.

| Problem | Solution | Result |
|---|---|---|
| LGU sites load slowly on rural 3G networks | Ultra-lightweight static assets without heavy runtime frameworks | Loads under 1 second on mobile devices |
| Compliance reports get lost in site updates | Structured JSON schemas for DILG FDP and ARTA Citizen's Charter | 100% verified compliance data |
| Content updates require code changes | Separated data files (`data/*.json`) and Markdown advisories | Staff update plain JSON files safely |
| Unvalidated data causes portal errors | Built-in Python validator script (`scripts/validate_data.py`) | Automated CI/CD validation before launch |

## Architecture

```
┌────────────────────────┐    ┌─────────────────────────┐    ┌────────────────────────┐
│  Data Layer (JSON/MD)  │───▶│  Validation Pipeline    │───▶│  Client Web App (JS)   │
│  - lgu_config.json     │    │  (validate_data.py)     │    │  - index.html          │
│  - citizens_charter    │    │  - Schema invariants    │    │  - app.js              │
│  - fdp_portal.json     │    │  - PSGC code checks     │    │  - style.css           │
└────────────────────────┘    └─────────────────────────┘    └────────────────────────┘
```

Pipeline stages:

1. **Configure** - Update LGU identity, PSGC code, official contacts, and mayor message in `data/lgu_config.json`.
2. **Catalog** - Record municipal services and fees under `data/citizens_charter.json` per ARTA guidelines.
3. **Publish** - Upload financial and procurement reports into `data/fdp_portal.json` per DILG rules.
4. **Validate** - `scripts/validate_data.py` verifies required keys, date formats, and PSGC digits before deployment.
5. **Render** - `js/app.js` renders responsive cards, searchable service tables, and emergency hotline lists.

## Features

- **Fast mobile performance** - Pure vanilla HTML5, CSS3, and JavaScript asset structure.
- **ARTA Citizen's Charter search** - Instant client-side search for municipal services and fees.
- **DILG FDP Transparency Portal** - Organized quarterly budget, SEF, and procurement document listings.
- **24/7 Emergency Hotline Hub** - Prominent emergency contact display for MDRRMO, Police, and Fire stations.
- **PSGC & Email Validation** - Python script checks 10-digit PSGC codes and contact details.
- **Automated CI/CD** - GitHub Actions workflow runs unit tests and data validation on every git push.

## Tech Stack

| Component      | Technology                                        |
| -------------- | ------------------------------------------------- |
| Web Engine     | Vanilla HTML5, CSS3, JavaScript (ES6+)            |
| Data Format    | Standard JSON and Markdown                        |
| Validation     | Python 3.9+ (Stdlib `json`, `re`, `pathlib`)      |
| Schema Specs   | JSON Schema (Draft-07 specification)              |
| Testing        | Python `unittest` framework                       |
| CI/CD Pipeline | GitHub Actions                                    |

## Validation Rules

The `scripts/validate_data.py` validator enforces mandatory LGU invariants:

- **PSGC Code**: Exactly 10 digits matching Philippine Standard Geographic Code standards.
- **LGU Classification**: Validates `Barangay`, `Municipality`, `City`, or `Province`.
- **ARTA Service Types**: Enforces `Simple`, `Complex`, or `Highly Technical` classifications.
- **DILG FDP Quarters**: Enforces `Q1`, `Q2`, `Q3`, `Q4`, or `Annual` tags.

## Repository Layout

```
lgu-ph-web/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── data/
│   ├── lgu_config.json         # LGU identity, PSGC code, contacts
│   ├── citizens_charter.json   # ARTA-compliant service listings
│   ├── fdp_portal.json         # DILG Full Disclosure Policy files
│   ├── emergency_contacts.json # Emergency hotline directory
│   └── news/                   # Local advisories (Markdown)
├── docs/
│   ├── fdp/                    # DILG FDP & BAC disclosure PDF files
│   ├── COMPLIANCE.md           # DILG, ARTA, DICT regulatory framework
│   └── ARCHITECTURE.md         # Data model and frontend design
├── schemas/                    # JSON Schema specification files
├── css/style.css               # Mobile-first CSS stylesheet
├── js/app.js                   # Dynamic data rendering and search
├── index.html                  # Responsive LGU portal frontend
├── scripts/
│   ├── validate_data.py        # Python data validation tool
│   └── generate_fdp_pdfs.py    # FDP PDF disclosure generator
├── tests/
│   └── test_validator.py       # Automated unit test suite
├── .gitignore
├── LICENSE
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.9 or newer (no external pip dependencies required)
- Any standard web browser

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/kerwinarlan/lgu-ph-web.git
cd lgu-ph-web

# 2. Run data validation
python3 scripts/validate_data.py

# 3. Run unit tests
python3 -m unittest discover -s tests/
```

### Preview locally

Serve the root directory with Python's built-in HTTP server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your web browser.

## Validation

Run automated tests to verify schema compliance:

```bash
python3 -m unittest discover -s tests/
```
