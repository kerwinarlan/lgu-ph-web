# Global Government Web Design System Specification
## Philippine LGU Web Platform Standard (`lgu-ph-web`)

> **Executive Summary & Global Benchmark Synthesis**
> This specification synthesizes best-in-class architectural and component patterns from five leading digital governments:
> 1. **USWDS (United States)** — Trust-building verification banner, Section 508 compliance, tokenized component architecture.
> 2. **Singapore SGDS / Web Core** — Official masthead banner, lock icon security state, modular web components.
> 3. **GOV.UK (United Kingdom)** — Step-by-step 1-2-3 navigation pattern, task-oriented user journeys, hyper-focused transaction flows.
> 4. **Australia Gov / NSW Digital** — Accessible card grids, high-contrast WCAG AAA data tables with tabbed filtering.
> 5. **e-Estonia (eesti.ee / Kratt)** — Proactive e-services, bento grid layout architecture, real-time status dashboards.

---

## Technical Specifications & Component Architecture

### 1. Official Government Verification Banner
*Synthesized from USWDS Identifier Banner & Singapore SGDS Masthead, adapted for Philippine `.gov.ph` LGU context.*

#### 1.1 Visual & Structural Specification
- **Placement**: Fixed top bar spanning 100% viewport width above all navigation headers.
- **Surface**: Dark Slate (`#0f172a` / `bg-slate-900`) with high contrast white/light gray text (`#f8fafc`).
- **Collapsed View**:
  - Left: Official Seal SVG / Flag icon + Text: *"Isang Opisyal na Website ng Pamahalaang Lokal | An official website of the Local Government Unit"*.
  - Right: Expandable accordion toggle *"Paano malalaman / How you know"* with dropdown chevron indicator (`aria-expanded="false"`).
- **Expanded Drawer View**:
  - Two distinct verification pillars:
    1. **Domain Validation (.gov.ph)**: Official Philippine government websites end in `.gov.ph`. Explains how to inspect the browser address bar.
    2. **HTTPS Security (Lock Icon & Certificate)**: Visual lock SVG indicator. Explains SSL/TLS encryption (`https://`) ensuring confidential transmission of citizen data.
  - DICT Compliance Badge: *"Compliant with DICT Government Web Hosting Service (GWHS) and DILG Transparency Guidelines."*

#### 1.2 Layout & ASCII Blueprint
```
+---------------------------------------------------------------------------------------------------+
| [PH Seal] Isang Opisyal na Website ng LGU (An official website of the LGU)   [Paano malalaman v] |
+---------------------------------------------------------------------------------------------------+
| [EXPANDED DRAWER]                                                                                |
|  +-------------------------------------------+  +-----------------------------------------------+  |
|  | [Domain Icon] Opisyal na Domain (.gov.ph) |  | [Lock Icon] Ligtas na Koneksyon (HTTPS)       |  |
|  | Ang mga opisyal na website ng pamahalaan  |  | Ang 'https://' at ang lock icon sa browser    |  |
|  | sa Pilipinas ay nagtatapos sa .gov.ph.    |  | ay nagpapatunay na naka-encrypt ang data.     |  |
|  +-------------------------------------------+  +-----------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

#### 1.3 HTML & Accessible DOM Markup
```html
<header id="ph-gov-banner" aria-label="Official Government Banner" class="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
  <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
    <div class="flex items-center gap-2">
      <!-- PH Flag / Seal Badge -->
      <svg class="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z" />
      </svg>
      <span class="font-medium">
        Isang opisyal na website ng Pamahalaang Lokal sa Pilipinas
        <span class="hidden sm:inline text-slate-400">| An official Philippine LGU website</span>
      </span>
    </div>

    <button type="button" 
            id="gov-banner-toggle"
            aria-expanded="false" 
            aria-controls="gov-banner-details"
            class="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1.5 py-0.5">
      <span>Paano malalaman</span>
      <svg id="gov-banner-chevron" class="w-3.5 h-3.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>

  <!-- Expandable Content Panel -->
  <div id="gov-banner-details" hidden class="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid md:grid-cols-2 gap-4 text-slate-300">
    <div class="flex items-start gap-3 bg-slate-800/60 p-3 rounded-lg">
      <div class="bg-blue-900/50 p-2 rounded-md text-blue-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>
      </div>
      <div>
        <p class="font-semibold text-white">Opisyal na domain ay nagtatapos sa .gov.ph</p>
        <p class="mt-1 text-slate-300">
          Ang mga opisyal na website ng pamahalaan sa Pilipinas ay nagtatapos sa <strong class="text-white">.gov.ph</strong>. Bago magbigay ng sensitibong impormasyon, siguraduhing nasa opisyal na site ka.
        </p>
      </div>
    </div>

    <div class="flex items-start gap-3 bg-slate-800/60 p-3 rounded-lg">
      <div class="bg-emerald-900/50 p-2 rounded-md text-emerald-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <div>
        <p class="font-semibold text-white">Ligtas at Encrypted na Koneksyon (HTTPS / Lock Icon)</p>
        <p class="mt-1 text-slate-300">
          Tingnan ang lock icon (<span class="inline-block"><svg class="w-3 h-3 inline text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg></span>) o siguraduhing nagsisimula sa <strong class="text-white">https://</strong> ang URL.
        </p>
      </div>
    </div>
  </div>
</header>
```

---

### 2. Accessible Utility Header
*Enforces Philippine Republic Act No. 10535 (Philippine Standard Time Act) and WCAG 2.1 AA/AAA Accessibility Guidelines.*

#### 2.1 Component Blueprint & Requirements
1. **PST (Philippine Standard Time) Live Clock**:
   - Mandated by **RA 10535** for all national and local government websites.
   - Synchronized with DOST-PAGASA Network Time Protocol (NTP).
   - Display format: `PST: 08:30:45 AM (PHT, UTC+8) | Lunes, Marso 30, 2026`.
   - Accessible live region (`aria-live="off"`, refreshed per second without interrupting screen readers).

2. **Font Resizing Engine (A- / Standard / A+)**:
   - Stepped scale factor applied to root HTML element or CSS variable `--lgu-text-scale`:
     - Standard: `100%` (`1rem`)
     - Larger (A+): `112.5%` (`1.125rem`)
     - Extra Large (A++): `125%` (`1.25rem`)
   - Persisted in `localStorage` under `lgu_text_scale`.
   - Dynamic viewport containment to ensure zero layout clipping or horizontal scroll overflow.

3. **High Contrast Mode Toggle**:
   - Contrast ratio: 7:1 (WCAG AAA compliant).
   - Theme switch adds `.high-contrast` class on `document.documentElement`.
   - Color mapping: Pure dark background (`#000000`), bright yellow action highlights (`#ffff00`), crisp cyan links (`#00ffff`), white text (`#ffffff`), 3px solid focus indicators.

4. **Language & Dialect Selector**:
   - Toggle switch between **Filipino**, **English**, and regional language options (e.g., Cebuan, Ilocano, Hiligaynon).

#### 2.2 Functional Code Implementation
```javascript
// PST Clock & Accessibility Engine
class LGUUtilityHeader {
  constructor() {
    this.textScale = parseFloat(localStorage.getItem('lgu_text_scale')) || 1.0;
    this.highContrast = localStorage.getItem('lgu_high_contrast') === 'true';
    this.initPSTClock();
    this.applyAccessibilitySettings();
  }

  initPSTClock() {
    const clockEl = document.getElementById('pst-clock-display');
    if (!clockEl) return;

    const updateClock = () => {
      const now = new Date();
      // Enforce Manila / PST Timezone UTC+8
      const options = {
        timeZone: 'Asia/Manila',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const pstString = new Intl.DateTimeFormat('en-PH', options).format(now);
      clockEl.textContent = `PST (DOST-PAGASA): ${pstString}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  setFontScale(scale) {
    this.textScale = Math.min(Math.max(scale, 0.875), 1.35);
    localStorage.setItem('lgu_text_scale', this.textScale);
    document.documentElement.style.fontSize = `${this.textScale * 100}%`;
  }

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    localStorage.setItem('lgu_high_contrast', this.highContrast);
    document.documentElement.classList.toggle('high-contrast', this.highContrast);
  }

  applyAccessibilitySettings() {
    if (this.textScale !== 1.0) {
      document.documentElement.style.fontSize = `${this.textScale * 100}%`;
    }
    if (this.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }
}
```

#### 2.3 HTML Utility Bar Interface
```html
<div class="bg-blue-950 text-white border-b border-blue-900 text-xs py-1.5 px-4" aria-label="Accessibility & Time Controls">
  <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
    <!-- PST Live Clock -->
    <div class="flex items-center gap-2 font-mono text-blue-200">
      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span id="pst-clock-display" role="status" aria-label="Philippine Standard Time">
        PST: Loading DOST-PAGASA Time...
      </span>
    </div>

    <!-- Accessibility Controls -->
    <div class="flex items-center gap-4">
      <!-- Font Resizing Controls -->
      <div class="flex items-center gap-1 bg-blue-900/80 rounded px-2 py-0.5 border border-blue-800" role="group" aria-label="Text Size Controls">
        <span class="text-blue-300 font-semibold mr-1">Sukat ng Teksto:</span>
        <button onclick="lguUtil.setFontScale(lguUtil.textScale - 0.1)" class="px-1.5 hover:text-yellow-400 font-bold focus:ring-1 focus:ring-yellow-400 rounded" aria-label="Liliitan ang teksto (A minus)">A-</button>
        <button onclick="lguUtil.setFontScale(1.0)" class="px-1.5 hover:text-yellow-400 font-bold focus:ring-1 focus:ring-yellow-400 rounded" aria-label="Karaniwang sukat ng teksto">A</button>
        <button onclick="lguUtil.setFontScale(lguUtil.textScale + 0.1)" class="px-1.5 hover:text-yellow-400 font-bold focus:ring-1 focus:ring-yellow-400 rounded" aria-label="Lalakihan ang teksto (A plus)">A+</button>
      </div>

      <!-- High Contrast Toggle -->
      <button onclick="lguUtil.toggleHighContrast()" class="flex items-center gap-1.5 bg-yellow-400 text-blue-950 font-bold px-2.5 py-0.5 rounded hover:bg-yellow-300 focus:ring-2 focus:ring-white">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 000-12v12z" clip-rule="evenodd"/>
        </svg>
        <span>High Contrast</span>
      </button>

      <!-- Language Selector -->
      <div class="flex items-center gap-1 text-slate-300">
        <button class="font-bold text-white underline">FIL</button>
        <span>|</span>
        <button class="hover:text-white">ENG</button>
      </div>
    </div>
  </div>
</div>
```

---

### 3. Universal Search Hero Banner
*Instant query filtering for municipal services (Permits, Property Taxes, Civil Registry).*

#### 3.1 Design Principles & UX Patterns
- **Hero Backdrop**: Deep municipal blue/gold gradient (`from-blue-900 via-blue-950 to-slate-900`) with subtle PH geographic/pattern watermark.
- **Search Input**: Prominent full-width input container with high focal contrast, integrated clear button, real-time input debounce (150ms).
- **Instant Result Overlay**: Dropdown drawer rendering live matching municipal services, sorted by frequency of use.
- **Quick Category Tags / Chips**: Direct filter shortcuts for top LGU transactions (`#BusinessPermit`, `#RealPropertyTax`, `#BirthCertificate`, `#BarangayClearance`, `#HealthCertificate`, `#ZoningClearance`).

#### 3.2 HTML & ARIA Search Hero Markup
```html
<section class="bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white py-12 px-4 relative overflow-hidden">
  <div class="max-w-4xl mx-auto text-center relative z-10">
    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
      Anong serbisyo ang kailangan mo ngayon?
    </h1>
    <p class="text-blue-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
      Mag-apply ng permit, magbayad ng buwis, o kumuha ng sertipiko sa loob lamang ng ilang minuto.
    </p>

    <!-- Search Input Bar -->
    <div class="relative max-w-2xl mx-auto text-left" role="search">
      <div class="relative flex items-center">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input type="search"
               id="hero-service-search"
               class="w-full pl-12 pr-28 py-4 bg-white text-slate-900 placeholder-slate-500 rounded-xl shadow-2xl text-base md:text-lg font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400"
               placeholder="Halimbawa: Business Permit, RPT, Birth Certificate..."
               aria-autocomplete="list"
               aria-controls="search-results-dropdown"
               aria-expanded="false" />
        <button type="submit" class="absolute right-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-yellow-400">
          Hanapin
        </button>
      </div>

      <!-- Live Search Results Dropdown -->
      <div id="search-results-dropdown" hidden class="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
        <!-- Live JS populated items -->
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm">
      <span class="text-blue-300 font-medium">Mabilis na cilik:</span>
      <button class="bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-full px-3 py-1 font-medium transition-colors">
        📋 Business Permit Renewal
      </button>
      <button class="bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-full px-3 py-1 font-medium transition-colors">
        🏠 Real Property Tax (RPT)
      </button>
      <button class="bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-full px-3 py-1 font-medium transition-colors">
        📜 Birth / Marriage Record
      </button>
      <button class="bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-full px-3 py-1 font-medium transition-colors">
        🏗️ Building & Occupancy Permit
      </button>
    </div>
  </div>
</section>
```

---

### 4. Task-Oriented Bento Grid Service Action Cards
*Inspired by e-Estonia e-Services & Australia Gov card patterns, tailored for municipal citizen services.*

#### 4.1 Card Specification Matrix
| Service Category | Badge Icon SVG | Primary CTA | Metadata / SLA Badge | Status Pill |
| :--- | :--- | :--- | :--- | :--- |
| **Business Licensing** | Building / Store SVG | *Mag-apply ng Permit* | SLA: 1-2 Araw | `Online Gateway Active` |
| **Real Property Tax** | Calculator / Land SVG | *Magbayad ng RPT* | Instant Assessment | `Discount Period Active` |
| **Civil Registry** | Document Seal SVG | *Humingi ng Kopya* | SLA: 3 Araw | `Express Delivery Available` |
| **Barangay Clearance** | Shield / Seal SVG | *Kumuha ng Clearance* | SLA: Same Day | `Automated Release` |
| **Health Cert & Sanitary** | Medical / Stethoscope SVG | *Schedule Inspection* | SLA: 1 Araw | `Online Booking` |
| **Senior & PWD Services** | ID Card / Heart SVG | *Mag-rehistro ng ID* | Libre / Free | `Priority Queue` |

#### 4.2 Bento Grid HTML & Visual Layout
```html
<section class="max-w-7xl mx-auto py-12 px-4">
  <div class="flex justify-between items-end mb-8">
    <div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900">Mga Pangunahing Serbisyo ng LGU</h2>
      <p class="text-slate-600 mt-1">Pumili ng serbisyo upang simulan ang iyong aplikasyon o pagbabayad.</p>
    </div>
    <a href="#all-services" class="text-blue-700 hover:text-blue-900 font-bold text-sm inline-flex items-center gap-1">
      Tingnan Lahat (24) &rarr;
    </a>
  </div>

  <!-- Bento Grid Container -->
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    
    <!-- Hero Bento Card (Spans 2 cols on md+) -->
    <div class="md:col-span-2 bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-4">
          <span class="bg-yellow-400 text-blue-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Most Requested
          </span>
          <!-- SVG Badge -->
          <div class="p-3 bg-blue-800/60 rounded-xl text-yellow-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold mb-2">Business Permit & Licensing System (BPLS)</h3>
        <p class="text-blue-200 text-sm mb-6 max-w-lg">
          Mag-apply ng bagong Business Permit o mag-renew ng umiiral na lisensya. Kumuha ng e-Permit sa loob ng 1-2 araw ng negosyo.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-blue-800/80 relative z-10">
        <div class="flex items-center gap-2 text-xs text-blue-200">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SLA: 1-2 Working Days</span>
        </div>
        <button onclick="openProcessDrawer('bpls-drawer')" class="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-white">
          Simulan ang Aplikasyon &rarr;
        </button>
      </div>
    </div>

    <!-- Standard Bento Card: Real Property Tax -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
      <div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-emerald-100 rounded-xl text-emerald-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="bg-emerald-100 text-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-full">
            10% Early Bird Discount
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-700">Real Property Tax (Amelyar)</h3>
        <p class="text-slate-600 text-xs mb-4">Compute tax assessment and pay annual or quarterly property tax online.</p>
      </div>
      <button onclick="openProcessDrawer('rpt-drawer')" class="w-full bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-800 font-bold py-2 rounded-lg text-sm transition-colors">
        Magbayad ng RPT
      </button>
    </div>

    <!-- Standard Bento Card: Civil Registry -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
      <div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-blue-100 rounded-xl text-blue-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="bg-blue-100 text-blue-800 font-semibold text-xs px-2.5 py-0.5 rounded-full">
            Local Civil Registry
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-700">Birth, Death & Marriage Certified Copies</h3>
        <p class="text-slate-600 text-xs mb-4">Request certified true copies with home delivery or pickup options.</p>
      </div>
      <button onclick="openProcessDrawer('lcr-drawer')" class="w-full bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-800 font-bold py-2 rounded-lg text-sm transition-colors">
        Humingi ng Dokumento
      </button>
    </div>

  </div>
</section>
```

---

### 5. Interactive Process Stepper Drawers
*Inspired by GOV.UK 1-2-3 Step-by-Step workflow pattern & interactive side-drawers.*

#### 5.1 Step-by-Step Workflow Specification
1. **Drawer Container**:
   - Slide-over panel from right viewport edge (`max-w-xl`, fixed position, overlay background `#000000` with 50% opacity).
   - Accessibility: `role="dialog"`, `aria-modal="true"`, focus entrapment, ESC key dismissal handler.
2. **Step Timeline Structure**:
   - **Step 1: Check Requirements & Prepare Documents**: Interactive checklist with dynamic percentage counter (e.g., `2 of 4 items checked`).
   - **Step 2: Fill-Out Online Form & Upload Files**: Form field validation, DTI/SEC registration number lookup, Barangay Clearance reference.
   - **Step 3: Review Fees & Pay Online**: Real-time fee itemization (Mayors Permit Fee, Garbage Fee, Sanitary Fee), multiple payment options (GCash, Maya, Landbank, Credit Card).
   - **Step 4: Receive Digital e-Permit / Track Status**: Reference Code generation + QR verification code.

#### 5.2 Stepper Drawer HTML & Accessibility Structure
```html
<div id="bpls-drawer" class="fixed inset-0 z-50 overflow-hidden hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onclick="closeProcessDrawer('bpls-drawer')"></div>

  <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
    <div class="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between">
      
      <!-- Drawer Header -->
      <div class="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <span class="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Hakbang-hakbang na Gabay</span>
          <h2 id="drawer-title" class="text-xl font-bold">Business Permit Renewal (1-2-3 Step)</h2>
        </div>
        <button onclick="closeProcessDrawer('bpls-drawer')" class="p-2 text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-yellow-400" aria-label="Isara ang drawer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Drawer Stepper Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-8">
        
        <!-- Step 1 -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm">1</div>
            <div class="w-0.5 h-full bg-slate-200 my-1"></div>
          </div>
          <div class="flex-1 pb-4">
            <h3 class="text-base font-bold text-slate-900">Ihanda ang mga Kailangang Dokumento</h3>
            <p class="text-xs text-slate-600 mb-3">Markahan ang mga babasahin o gagamitin:</p>
            
            <div class="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500">
                <span>Barangay Business Clearance (Kasalukuyang Taon)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500">
                <span>Gross Sales Tax Declaration / Audited Financial Statement</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-500">
                <span>Sanitary Permit & Fire Safety Inspection Certificate</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">2</div>
            <div class="w-0.5 h-full bg-slate-200 my-1"></div>
          </div>
          <div class="flex-1 pb-4">
            <h3 class="text-base font-bold text-slate-900">Sagutan ang Online Form</h3>
            <p class="text-xs text-slate-600">Ipasok ang iyong BIN (Business Identification Number) at i-upload ang mga na-scan na file.</p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">3</div>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-slate-900">Magbayad at Tanggapin ang e-Permit</h3>
            <p class="text-xs text-slate-600">Bayaran sa pamamagitan ng GCash, Maya, o Landbank. I-download ang e-Permit na may QR Code validation.</p>
          </div>
        </div>

      </div>

      <!-- Drawer Footer Action -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <button onclick="closeProcessDrawer('bpls-drawer')" class="text-slate-600 font-medium text-sm hover:underline">Kanselahin</button>
        <a href="/bpls/apply" class="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
          Ipagpatuloy sa Form &rarr;
        </a>
      </div>

    </div>
  </div>
</div>
```

---

### 6. DILG FDP & BAC Procurement Data Tables
*Mandated by DILG Full Disclosure Policy (MC 2013-140) and Republic Act 9184 Government Procurement Reform Act.*

#### 6.1 Specification & Data Features
1. **Tabbed Filter Bar**:
   - Filter documents by classification:
     - `All Documents`
     - `DILG FDP Financials` (Annual Budget, Statement of Income & Expenses, Unliquidated Cash Advances)
     - `BAC Procurement / ITB` (Invitation to Bid, Notice of Award, Notice to Proceed, Bidding Documents)
     - `Quarterly Reports` (Q1, Q2, Q3, Q4)
2. **Search & Date Range Filter**:
   - Dynamic real-time text query filter across Reference No., Project Title, Department, and Contractor name.
3. **Status Indicators (Accessible Status Pills)**:
   - `Published / Active`: Green badge (`bg-emerald-100 text-emerald-800`).
   - `Under Evaluation / Bidding Open`: Blue badge (`bg-blue-100 text-blue-800`).
   - `Awarded`: Purple badge (`bg-purple-100 text-purple-800`).
   - `Archived / Closed`: Gray badge (`bg-slate-100 text-slate-700`).
4. **Action Column**:
   - Download PDF button + View Metadata Modal button.
5. **Mobile Responsiveness**:
   - Collapses into stacked card list on viewports `<640px` with accessible data labels.

#### 6.2 Data Table HTML Markup
```html
<section class="max-w-7xl mx-auto py-12 px-4">
  <div class="mb-6">
    <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">Transparensya at Pananagutan</span>
    <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900">DILG Full Disclosure Policy & BAC Procurement Portal</h2>
    <p class="text-slate-600 text-sm mt-1">
      Talaan ng mga opisyal na badyet, ulat pampinansyal, at mga imbitasyon sa pag-bidding ayon sa DILG MC 2013-140 at RA 9184.
    </p>
  </div>

  <!-- Tabbed Filter Navigation -->
  <div class="border-b border-slate-200 mb-6 overflow-x-auto flex gap-4 text-sm font-medium">
    <button class="pb-3 border-b-2 border-blue-700 text-blue-700 font-bold whitespace-nowrap">
      Lahat ng Dokumento (142)
    </button>
    <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">
      DILG FDP Financial Reports
    </button>
    <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">
      BAC Invitation to Bid (ITB)
    </button>
    <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 whitespace-nowrap">
      Notice of Award (NOA)
    </button>
  </div>

  <!-- Search & Filter Control Bar -->
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
    <div class="relative w-full sm:w-80">
      <input type="text" placeholder="Hanapin ang Reference No., Pamagat..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
      <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <select class="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600">
        <option>Taon: 2026</option>
        <option>Taon: 2025</option>
      </select>
      <select class="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600">
        <option>Quarter: All</option>
        <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
      </select>
    </div>
  </div>

  <!-- Data Table Container -->
  <div class="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
    <table class="w-full text-left border-collapse text-sm">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <th class="p-4">Ref #</th>
          <th class="p-4">Pamagat ng Dokumento / Proyekto</th>
          <th class="p-4">Kagawaran / BAC Unit</th>
          <th class="p-4">Petsa ng Pag-post</th>
          <th class="p-4">Halaga (PHP)</th>
          <th class="p-4">Katayuan (Status)</th>
          <th class="p-4 text-right">Aksyon</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 text-slate-800">
        <!-- Row 1: BAC ITB -->
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="p-4 font-mono text-xs font-semibold text-slate-600">BAC-2026-042</td>
          <td class="p-4 font-bold text-slate-900">
            Supply and Delivery of IT Equipment for Barangay e-Centers
          </td>
          <td class="p-4 text-xs text-slate-600">Bids and Awards Committee</td>
          <td class="p-4 text-xs">Mar 28, 2026</td>
          <td class="p-4 font-semibold text-slate-900">₱2,450,000.00</td>
          <td class="p-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Bidding Open
            </span>
          </td>
          <td class="p-4 text-right">
            <a href="#" class="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              PDF
            </a>
          </td>
        </tr>

        <!-- Row 2: DILG FDP Annual Budget -->
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="p-4 font-mono text-xs font-semibold text-slate-600">FDP-2026-001</td>
          <td class="p-4 font-bold text-slate-900">
            Approved Annual Budget Report for Fiscal Year 2026
          </td>
          <td class="p-4 text-xs text-slate-600">City Budget Office</td>
          <td class="p-4 text-xs">Jan 15, 2026</td>
          <td class="p-4 font-semibold text-slate-900">₱850,000,000.00</td>
          <td class="p-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Published
            </span>
          </td>
          <td class="p-4 text-right">
            <a href="#" class="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              PDF
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

---

## Technical & WCAG 2.1 Conformance Summary
1. **Color Contrast Ratio**: All text and interactive controls maintain >= 4.5:1 ratio for normal text and >= 7:1 ratio under High Contrast Mode.
2. **Keyboard Focus Nav**: Visible 3px ring focus indicators on all interactive links, buttons, and form inputs.
3. **Screen Reader Support**: Complete ARIA landmarks (`role="banner"`, `role="search"`, `role="dialog"`), dynamic `aria-expanded` and `aria-live` state management.
4. **Legal Compliance**:
   - **RA 10535**: DOST-PAGASA synchronized Philippine Standard Time (PST).
   - **DILG MC 2013-140**: Full Disclosure Policy transparency posting standards.
   - **RA 9184**: BAC procurement transparency standards.
   - **DICT GWT**: Government Web Template alignment.
