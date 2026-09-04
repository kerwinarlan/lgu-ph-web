document.addEventListener("DOMContentLoaded", async () => {
  // Initialize interactive utility modules
  initPSTClock();
  initGovBannerToggle();
  initAccessibilityEngine();
  initThemeEngine();
  initUniversalSearch();
  initStatCounters();
  initCharterTableDelegation();

  // Resilient multi-resource fetch
  const [lgu, charter, fdp, emergency] = await Promise.all([
    fetchJSON("data/lgu_config.json"),
    fetchJSON("data/citizens_charter.json"),
    fetchJSON("data/fdp_portal.json"),
    fetchJSON("data/emergency_contacts.json")
  ]);

  if (lgu) renderLGUHeader(lgu);
  else renderSectionError("lgu-header-info", "Municipal details temporarily unavailable.");

  if (emergency) renderEmergencyContacts(emergency);
  else renderSectionError("emergency-contacts", "Emergency hotline directory unavailable.");

  if (charter) renderCitizensCharter(charter);
  else renderSectionError("charter-table-body", "Citizen's Charter database unavailable.");

  if (fdp) {
    renderBACNotices(fdp);
    renderFDPDocuments(fdp);
  } else {
    renderSectionError("bac-table-body", "Procurement notices unavailable.");
    renderSectionError("fdp-table-body", "FDP financial documents unavailable.");
  }

  initModalHandlers();
});

// Helper for safe HTML escaping to prevent XSS
function escapeHTML(str) {
  if (typeof str !== "string") return str ?? "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Resilient JSON fetch helper checking HTTP response status
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[LGU Portal] Failed to fetch resource '${url}':`, err);
    return null;
  }
}

function renderSectionError(elementId, message) {
  const elem = document.getElementById(elementId);
  if (!elem) return;
  if (elem.tagName === "TBODY") {
    elem.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1.5rem;">⚠️ ${escapeHTML(message)}</td></tr>`;
  } else {
    elem.innerHTML = `<div style="padding:1rem;">⚠️ ${escapeHTML(message)}</div>`;
  }
}

// Official Government Banner Accordion Toggle
function initGovBannerToggle() {
  const toggleBtn = document.getElementById("gov-banner-toggle");
  const detailsPanel = document.getElementById("gov-banner-details");
  if (!toggleBtn || !detailsPanel) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    detailsPanel.hidden = isExpanded;
  });
}

// Accessibility Text Resize Engine
function initAccessibilityEngine() {
  const root = document.documentElement;
  const btnDecrease = document.getElementById("btn-font-decrease");
  const btnReset = document.getElementById("btn-font-reset");
  const btnIncrease = document.getElementById("btn-font-increase");
  const btnContrast = document.getElementById("btn-high-contrast");

  // Load saved font scale preference
  const savedScale = localStorage.getItem("lgu_text_scale") || "normal";
  const savedContrast = localStorage.getItem("lgu_high_contrast") === "true";

  const setScale = (scaleClass) => {
    root.classList.remove("text-scale-sm", "text-scale-lg", "text-scale-xl");
    if (scaleClass !== "normal") root.classList.add(scaleClass);
    localStorage.setItem("lgu_text_scale", scaleClass);
  };

  if (savedScale !== "normal") setScale(savedScale);
  if (savedContrast) root.classList.add("high-contrast");

  if (btnDecrease) btnDecrease.addEventListener("click", () => setScale("text-scale-sm"));
  if (btnReset) btnReset.addEventListener("click", () => setScale("normal"));
  if (btnIncrease) btnIncrease.addEventListener("click", () => setScale("text-scale-lg"));

  if (btnContrast) {
    btnContrast.addEventListener("click", () => {
      const isContrast = root.classList.toggle("high-contrast");
      localStorage.setItem("lgu_high_contrast", isContrast);
      showToast(isContrast ? "High contrast mode enabled" : "Standard contrast restored");
    });
  }
}

// Dedicated Light / Dark Mode Theme Engine
function initThemeEngine() {
  const root = document.documentElement;
  const btnTheme = document.getElementById("btn-theme-toggle");

  const updateButtonText = (isDark) => {
    if (!btnTheme) return;
    btnTheme.innerHTML = isDark ? "<span>☀️ Light Mode</span>" : "<span>🌙 Dark Mode</span>";
  };

  // Saved theme or OS preference
  const savedTheme = localStorage.getItem("lgu_theme");
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;

  if (isDark) root.classList.add("dark-theme");
  updateButtonText(isDark);

  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const activeDark = root.classList.toggle("dark-theme");
      localStorage.setItem("lgu_theme", activeDark ? "dark" : "light");
      updateButtonText(activeDark);
      showToast(activeDark ? "Dark theme enabled" : "Light theme restored");
    });
  }
}

// Universal Search Bar Filtering & Keyboard Shortcut
function initUniversalSearch() {
  const searchInput = document.getElementById("universal-search-input");
  const clearBtn = document.getElementById("universal-search-clear");
  if (!searchInput) return;

  // '/' shortcut when not in input/textarea
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    // Esc to blur search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  const performFilter = (query) => {
    const q = query.toLowerCase().trim();

    if (clearBtn) {
      clearBtn.classList.toggle("active", q.length > 0);
    }

    // Filter Citizen's Charter table
    if (window.charterServicesData) {
      const filteredCharter = q === "" 
        ? window.charterServicesData 
        : window.charterServicesData.filter(s =>
            s.service_name.toLowerCase().includes(q) ||
            s.office.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            s.classification.toLowerCase().includes(q)
          );
      renderCharterRows(filteredCharter);
    }

    // Filter BAC Procurement table
    if (window.bacNoticesData) {
      const filteredBAC = q === ""
        ? window.bacNoticesData
        : window.bacNoticesData.filter(b =>
            b.title.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
          );
      renderBACRows(filteredBAC);
    }
  };

  searchInput.addEventListener("input", (e) => performFilter(e.target.value));

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      performFilter("");
      searchInput.focus();
    });
  }
}

// Animated Stat Counter Physics
function initStatCounters() {
  const counterElems = document.querySelectorAll("[data-count]");
  if (!counterElems.length) return;

  const animateCounter = (elem) => {
    const target = parseFloat(elem.getAttribute("data-count"));
    const decimals = parseInt(elem.getAttribute("data-decimals") || "0", 10);
    const suffix = elem.getAttribute("data-suffix") || "";

    const duration = 1200; // ms
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = target * easeProgress;

      elem.textContent = currentValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  };

  // Intersection Observer to trigger counter animation on scroll into view
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counterElems.forEach(elem => observer.observe(elem));
}

function initPSTClock() {
  const clockElem = document.getElementById("pst-clock");
  if (!clockElem) return;

  const updateClock = () => {
    const now = new Date();
    const options = {
      timeZone: "Asia/Manila",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    clockElem.textContent = new Intl.DateTimeFormat("en-PH", options).format(now) + " PST";
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function renderLGUHeader(lgu) {
  const headerElem = document.getElementById("lgu-header-info");
  if (headerElem) {
    headerElem.innerHTML = `
      <h1>${escapeHTML(lgu.lgu_name)}</h1>
      <p>
        <span>Province of ${escapeHTML(lgu.province)}</span> &bull; 
        <span>${escapeHTML(lgu.region)}</span> &bull; 
        <span class="psgc-pill">PSGC ${escapeHTML(lgu.psgc_code)}</span>
      </p>
    `;
  }

  const mayorBox = document.getElementById("mayor-message-box");
  if (mayorBox && lgu.mayor) {
    mayorBox.innerHTML = `
      <p>"${escapeHTML(lgu.mayor.message)}"</p>
      <div class="executive-signature">
        <span>&mdash; ${escapeHTML(lgu.mayor.name)}, ${escapeHTML(lgu.mayor.title || 'Municipal Mayor')} (${escapeHTML(lgu.mayor.term)})</span>
        <span class="executive-location">Tanza, Cavite</span>
      </div>
    `;
  }
}

function renderEmergencyContacts(emergency) {
  const container = document.getElementById("emergency-contacts");
  if (!container || !emergency.hotlines) return;

  container.innerHTML = emergency.hotlines.map(h => `
    <li class="emergency-item">
      <div>
        <strong class="agency-title">${escapeHTML(h.agency)}</strong><br>
        <span class="phone-number">${escapeHTML(h.phone)}</span> <span class="landline-sub">(${escapeHTML(h.landline)})</span>
      </div>
      <div class="btn-group-hotline">
        <a href="tel:${h.phone.replace(/[^0-9+]/g, '')}" class="btn-call">CALL 24/7</a>
        <button type="button" class="btn-copy" data-hotline="${escapeHTML(h.phone)}">Copy</button>
      </div>
    </li>
  `).join("");

  if (!container.dataset.delegated) {
    container.dataset.delegated = "true";
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-copy");
      if (btn && btn.dataset.hotline) {
        copyHotline(btn.dataset.hotline, btn);
      }
    });
  }
}

function copyHotline(phoneNumber, btnElem) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(phoneNumber);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = phoneNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  showToast(`Copied ${phoneNumber} to clipboard!`);
  if (btnElem) {
    const origText = btnElem.textContent;
    btnElem.textContent = "Copied!";
    setTimeout(() => { btnElem.textContent = origText; }, 2000);
  }
}

let toastTimeoutId = null;
function showToast(message) {
  const toast = document.getElementById("toast-bar");
  if (!toast) return;
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toast.textContent = message;
  toast.classList.add("active");
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("active");
    toastTimeoutId = null;
  }, 3000);
}

function renderCitizensCharter(charter) {
  if (!charter || !charter.services) return;
  window.charterServicesData = charter.services;
  window.charterServicesMap = new Map(charter.services.map(s => [s.id, s]));
  renderCharterRows(charter.services);

  const localSearchInput = document.getElementById("charter-search");
  if (localSearchInput) {
    localSearchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = q === "" 
        ? charter.services 
        : charter.services.filter(s =>
            s.service_name.toLowerCase().includes(q) ||
            s.office.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q)
          );
      renderCharterRows(filtered);
    });
  }
}

function initCharterTableDelegation() {
  const tbody = document.getElementById("charter-table-body");
  if (!tbody || tbody.dataset.delegated) return;
  tbody.dataset.delegated = "true";

  const handleAction = (target) => {
    const row = target.closest("tr.interactive-row");
    if (row && row.dataset.charterId) {
      openCharterModal(row.dataset.charterId);
    }
  };

  tbody.addEventListener("click", (e) => handleAction(e.target));
  tbody.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(e.target);
    }
  });
}

function renderCharterRows(services) {
  const tbody = document.getElementById("charter-table-body");
  if (!tbody) return;

  if (!services || services.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No matching services found.</td></tr>`;
    return;
  }

  tbody.innerHTML = services.map(s => {
    let badgeClass = "badge-simple";
    if (s.classification === "Complex") badgeClass = "badge-complex";
    if (s.classification === "Highly Technical") badgeClass = "badge-technical";

    return `
      <tr class="interactive-row" data-charter-id="${escapeHTML(s.id)}" tabindex="0" role="button" aria-label="View details for ${escapeHTML(s.service_name)}">
        <td><strong>${escapeHTML(s.id)}</strong></td>
        <td><strong class="service-name-text">${escapeHTML(s.service_name)}</strong></td>
        <td>${escapeHTML(s.office)}</td>
        <td><span class="badge ${badgeClass}">${escapeHTML(s.classification)}</span></td>
        <td>${escapeHTML(s.processing_time)}</td>
        <td>${escapeHTML(s.fees)}</td>
      </tr>
    `;
  }).join("");
}

function openCharterModal(serviceId) {
  const s = window.charterServicesMap ? window.charterServicesMap.get(serviceId) : null;
  if (!s) return;

  const modal = document.getElementById("charter-modal");
  document.getElementById("modal-title").textContent = `${s.id} - ${s.service_name}`;
  document.getElementById("modal-office").textContent = `Responsible Office: ${s.office}`;
  document.getElementById("modal-time").textContent = s.processing_time;
  document.getElementById("modal-fees").textContent = s.fees;

  const badgeElem = document.getElementById("modal-badge");
  badgeElem.textContent = s.classification;
  badgeElem.className = `badge ${s.classification === "Complex" ? "badge-complex" : s.classification === "Highly Technical" ? "badge-technical" : "badge-simple"}`;

  const reqList = document.getElementById("modal-requirements");
  if (s.required_documents && s.required_documents.length) {
    reqList.innerHTML = s.required_documents.map(req => `<li>${escapeHTML(req)}</li>`).join("");
  } else {
    reqList.innerHTML = `<li>Complete filled application form</li>`;
  }

  const stepList = document.getElementById("modal-steps");
  if (s.steps && s.steps.length) {
    stepList.innerHTML = s.steps.map((step, idx) => `
      <li><strong>Step ${idx + 1}:</strong> ${escapeHTML(step)}</li>
    `).join("");
  } else {
    stepList.innerHTML = `<li>Submit complete documents at the assigned service window.</li>`;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function initModalHandlers() {
  const modal = document.getElementById("charter-modal");
  const closeBtn = document.getElementById("modal-close");
  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

function renderBACNotices(fdp) {
  if (!fdp || !fdp.documents) return;

  const bacDocs = fdp.documents.filter(d =>
    d.category === "Bids and Awards" || d.title.toLowerCase().includes("invitation to bid")
  );

  window.bacNoticesData = bacDocs;
  renderBACRows(bacDocs);
}

function renderBACRows(docs) {
  const tbody = document.getElementById("bac-table-body");
  if (!tbody) return;

  if (!docs || docs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No active procurement notices matching query.</td></tr>`;
    return;
  }

  tbody.innerHTML = docs.map((d, idx) => `
    <tr>
      <td><strong>TNZ-BAC-2025-0${idx + 1}</strong></td>
      <td><strong class="service-name-text">${escapeHTML(d.title)}</strong></td>
      <td>₱${(2500000 + idx * 1250000).toLocaleString('en-US')}</td>
      <td><span class="badge badge-active">Open for Bidding</span></td>
      <td><a href="${escapeHTML(d.file_url)}" target="_blank" rel="noopener noreferrer" class="pdf-link">Download PDF</a></td>
    </tr>
  `).join("");
}

function renderFDPDocuments(fdp) {
  const tbody = document.getElementById("fdp-table-body");
  const tabContainer = document.getElementById("fdp-tabs");
  if (!tbody || !fdp.documents) return;

  const categories = ["All", ...new Set(fdp.documents.map(d => d.category))];

  if (tabContainer) {
    tabContainer.innerHTML = categories.map((cat, idx) => `
      <button type="button" class="tab-btn ${idx === 0 ? 'active' : ''}" data-category="${escapeHTML(cat)}">${escapeHTML(cat)}</button>
    `).join("");

    tabContainer.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        tabContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        const selectedCat = e.target.getAttribute("data-category");
        const filtered = selectedCat === "All"
          ? fdp.documents
          : fdp.documents.filter(d => d.category === selectedCat);

        renderFDPRows(filtered);
      });
    });
  }

  const renderFDPRows = (docs) => {
    tbody.innerHTML = docs.map(d => `
      <tr>
        <td><strong class="service-name-text">${escapeHTML(d.category)}</strong></td>
        <td>${escapeHTML(d.title)}</td>
        <td>${escapeHTML(d.publication_date)}</td>
        <td><a href="${escapeHTML(d.file_url)}" target="_blank" rel="noopener noreferrer" class="pdf-link">Download PDF</a></td>
      </tr>
    `).join("");
  };

  renderFDPRows(fdp.documents);
}
