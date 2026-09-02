document.addEventListener("DOMContentLoaded", async () => {
  // Start live PST clock
  initPSTClock();

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
    initModalHandlers();
  } catch (err) {
    console.error("Failed to load LGU data:", err);
  }
});

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
      <h1>${lgu.lgu_name}</h1>
      <p>
        <span>Province of ${lgu.province}</span> | 
        <span>${lgu.region}</span> | 
        <span class="psgc-pill">PSGC ${lgu.psgc_code}</span>
      </p>
    `;
  }

  const mayorBox = document.getElementById("mayor-message-box");
  if (mayorBox && lgu.mayor) {
    mayorBox.innerHTML = `
      <p>"${lgu.mayor.message}"</p>
      <div class="executive-signature">
        <span>— ${lgu.mayor.name}, ${lgu.mayor.title || 'Municipal Mayor'} (${lgu.mayor.term})</span>
        <span style="color: var(--color-accent); font-weight: 800;">Tanza, Cavite</span>
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
        <span class="phone-number">${h.phone}</span> <span style="font-size:0.8rem;color:var(--text-muted)">(${h.landline})</span>
      </div>
      <div class="btn-group-hotline">
        <a href="tel:${h.phone.replace(/[^0-9+]/g, '')}" class="btn-call">CALL 24/7</a>
        <button class="btn-copy" onclick="copyHotline('${h.phone}', this)">Copy</button>
      </div>
    </li>
  `).join("");
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

function showToast(message) {
  const toast = document.getElementById("toast-bar");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => { toast.classList.remove("active"); }, 3000);
}

function renderCitizensCharter(charter) {
  const tbody = document.getElementById("charter-table-body");
  if (!tbody || !charter.services) return;

  const renderRows = (services) => {
    tbody.innerHTML = services.map(s => {
      let badgeClass = "badge-simple";
      if (s.classification === "Complex") badgeClass = "badge-complex";
      if (s.classification === "Highly Technical") badgeClass = "badge-technical";

      return `
        <tr class="interactive-row" onclick="openCharterModal('${s.id}')">
          <td><strong>${s.id}</strong></td>
          <td><strong style="color:var(--color-primary);">${s.service_name}</strong></td>
          <td>${s.office}</td>
          <td><span class="badge ${badgeClass}">${s.classification}</span></td>
          <td>${s.processing_time}</td>
          <td>${s.fees}</td>
        </tr>
      `;
    }).join("");
  };

  renderRows(charter.services);

  // Global reference for modal lookup
  window.charterServicesMap = new Map(charter.services.map(s => [s.id, s]));

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
    reqList.innerHTML = s.required_documents.map(req => `<li>${req}</li>`).join("");
  } else {
    reqList.innerHTML = `<li>Complete filled application form</li>`;
  }

  const stepList = document.getElementById("modal-steps");
  if (s.steps && s.steps.length) {
    stepList.innerHTML = s.steps.map((step, idx) => `
      <li><strong>Step ${idx + 1}:</strong> ${step}</li>
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
  const tbody = document.getElementById("bac-table-body");
  if (!tbody || !fdp.documents) return;

  const bacDocs = fdp.documents.filter(d =>
    d.category === "Bids and Awards" || d.title.toLowerCase().includes("invitation to bid")
  );

  if (bacDocs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No active procurement notices at this time.</td></tr>`;
    return;
  }

  tbody.innerHTML = bacDocs.map((d, idx) => `
    <tr>
      <td><strong>TNZ-BAC-2025-0${idx + 1}</strong></td>
      <td><strong style="color:var(--color-primary);">${d.title}</strong></td>
      <td>₱${(2500000 + idx * 1250000).toLocaleString('en-US')}</td>
      <td><span class="badge badge-active">Open for Bidding</span></td>
      <td><a href="${d.file_url}" target="_blank" style="color:var(--color-primary-light);font-weight:700;">Download PDF</a></td>
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
        <td><strong style="color:var(--color-primary);">${d.category}</strong></td>
        <td>${d.title}</td>
        <td>${d.publication_date}</td>
        <td><a href="${d.file_url}" target="_blank" style="color:var(--color-primary-light);font-weight:700;">Download PDF</a></td>
      </tr>
    `).join("");
  };

  renderFDPRows(fdp.documents);
}
