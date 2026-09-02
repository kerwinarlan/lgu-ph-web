document.addEventListener("DOMContentLoaded", async () => {
  startPSTClock();

  try {
    const [lguRes, charterRes, fdpRes, emergencyRes] = await Promise.all([
      fetch("data/lgu_config.json"),
      fetch("data/citizens_charter.json"),
      fetch("data/fdp_portal.json"),
      fetch("data/emergency_contacts.json")
    ]);

    const lgu = await lguRes.json();
    const charter = await charterRes.json();
    const fdp = await fdpRes.json();
    const emergency = await emergencyRes.json();

    renderLGUHeader(lgu);
    renderEmergencyContacts(emergency);
    renderCitizensCharter(charter);
    renderBACNotices(fdp);
    renderFDPDocuments(fdp);
    setupModalHandlers();
  } catch (err) {
    console.error("Failed to load LGU data:", err);
  }
});

/* Live PST Clock Updater (ticks every 1s) */
function startPSTClock() {
  const clockElem = document.getElementById("pst-clock");
  if (!clockElem) return;

  const updateClock = () => {
    const now = new Date();
    const options = {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    clockElem.textContent = `${now.toLocaleTimeString("en-US", options)} PST`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function renderLGUHeader(lgu) {
  const headerElem = document.getElementById("lgu-header-info");
  if (headerElem) {
    headerElem.innerHTML = `
      <h1>${lgu.lgu_name}</h1>
      <p>
        <span>Province of ${lgu.province}</span> | 
        <span>${lgu.region}</span> | 
        <span class="psgc-pill">PSGC Code ${lgu.psgc_code}</span>
      </p>
    `;
  }

  const mayorBox = document.getElementById("mayor-message-box");
  if (mayorBox && lgu.mayor) {
    mayorBox.innerHTML = `
      <p>"${lgu.mayor.message}"</p>
      <div class="executive-signature">
        <span>— ${lgu.mayor.name}, ${lgu.mayor.title || 'Municipal Mayor'} (${lgu.mayor.term})</span>
        <span style="color: var(--color-accent-hover); font-weight: 800; font-size: 0.8rem;">OFFICIAL EXECUTIVE STATEMENT</span>
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
        <strong>${h.agency}</strong><br>
        <span class="phone-number">${h.phone}</span> ${h.landline ? `<span style="color: var(--text-muted); font-size: var(--text-xs);">| ${h.landline}</span>` : ''}
      </div>
      <div class="btn-group-hotline">
        <button class="btn-copy" onclick="copyHotline('${h.phone}', this)" aria-label="Copy ${h.agency} number">Copy</button>
        <a href="tel:${h.phone.replace(/[^0-9+]/g, '')}" class="btn-call">CALL 24/7</a>
      </div>
    </li>
  `).join("");
}

function copyHotline(text, btnElem) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showCopiedFeedback(btnElem))
      .catch(() => fallbackCopy(text, btnElem));
  } else {
    fallbackCopy(text, btnElem);
  }
}

function fallbackCopy(text, btnElem) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showCopiedFeedback(btnElem);
  } catch (e) {
    showToast("Failed to copy phone number");
  }
  document.body.removeChild(ta);
}

function showCopiedFeedback(btnElem) {
  const origText = btnElem.textContent;
  btnElem.textContent = "Copied!";
  btnElem.style.background = "#dcfce7";
  btnElem.style.color = "#15803d";
  showToast("Phone number copied to clipboard!");
  setTimeout(() => {
    btnElem.textContent = origText;
    btnElem.style.background = "";
    btnElem.style.color = "";
  }, 2000);
}

function showToast(msg) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2500);
}

function renderCitizensCharter(charter) {
  const tbody = document.getElementById("charter-table-body");
  if (!tbody || !charter.services) return;

  const renderRows = (services) => {
    if (services.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No services match your search query.</td></tr>`;
      return;
    }

    tbody.innerHTML = services.map(s => {
      let badgeClass = "badge-simple";
      if (s.classification === "Complex") badgeClass = "badge-complex";
      if (s.classification === "Highly Technical") badgeClass = "badge-technical";

      return `
        <tr class="interactive-row" data-id="${s.id}" tabindex="0" role="button" aria-label="View details for ${s.service_name}">
          <td><strong>${s.id}</strong></td>
          <td><strong>${s.service_name}</strong></td>
          <td>${s.office}</td>
          <td><span class="badge ${badgeClass}">${s.classification}</span></td>
          <td>${s.processing_time}</td>
          <td>${s.fees}</td>
          <td><button class="btn-copy" style="background: var(--color-primary-light); color: #fff;">Details &rarr;</button></td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".interactive-row").forEach(row => {
      const serviceId = row.getAttribute("data-id");
      const service = charter.services.find(s => s.id === serviceId);

      const handleOpen = () => {
        if (service) openCharterModal(service);
      };

      row.addEventListener("click", handleOpen);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      });
    });
  };

  renderRows(charter.services);

  const searchInput = document.getElementById("charter-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = charter.services.filter(s =>
        s.service_name.toLowerCase().includes(q) ||
        s.office.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
      renderRows(filtered);
    });
  }
}

function openCharterModal(service) {
  const modal = document.getElementById("charter-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  if (!modal || !modalContent) return;

  if (modalTitle) {
    modalTitle.textContent = `${service.id} - ${service.service_name}`;
  }

  const docsList = (service.required_documents || ["Duly accomplished application form", "Valid Government-Issued ID"])
    .map(doc => `<li>${doc}</li>`).join("");

  const stepsList = (service.steps || ["Submit application at front desk", "Assessment and verification", "Payment at Treasury", "Issuance of clearance/permit"])
    .map((step, idx) => `
      <div style="display: flex; gap: 0.85rem; align-items: flex-start; margin-bottom: 0.75rem;">
        <span style="width: 28px; height: 28px; background: var(--color-primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0;">${idx + 1}</span>
        <div style="background: var(--bg-card-alt); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: var(--text-sm); flex-grow: 1; border-left: 3px solid var(--color-primary-light);">${step}</div>
      </div>
    `).join("");

  modalContent.innerHTML = `
    <div class="modal-section">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
        <span class="badge badge-active">Office: ${service.office}</span>
        <span class="badge badge-simple">Time: ${service.processing_time}</span>
        <span class="badge badge-complex">Fees: ${service.fees}</span>
      </div>
    </div>

    <div class="modal-section">
      <h4>Required Documents</h4>
      <ul class="modal-list">${docsList}</ul>
    </div>

    <div class="modal-section">
      <h4>Step-by-Step Procedure</h4>
      <div>${stepsList}</div>
    </div>
  `;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function setupModalHandlers() {
  const modal = document.getElementById("charter-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }
}

function renderBACNotices(fdp) {
  const tbody = document.getElementById("bac-table-body");
  if (!tbody || !fdp.bac_notices) return;

  tbody.innerHTML = fdp.bac_notices.map(n => `
    <tr>
      <td><strong>${n.id}</strong></td>
      <td><strong>${n.title}</strong></td>
      <td>${n.publication_date}</td>
      <td><span class="badge badge-simple">${n.status || 'Active Bidding'}</span></td>
      <td><a href="${n.file_url}" target="_blank" style="color: var(--color-primary-light); font-weight: 700; text-decoration: none;">View Invitation &rarr;</a></td>
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
      <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>
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
        <td><strong>${d.category}</strong></td>
        <td>${d.title}</td>
        <td>${d.publication_date}</td>
        <td><a href="${d.file_url}" target="_blank" style="color: var(--color-primary-light); font-weight: 700; text-decoration: none;">Download PDF &rarr;</a></td>
      </tr>
    `).join("");
  };

  renderFDPRows(fdp.documents);
}