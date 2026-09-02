document.addEventListener("DOMContentLoaded", async () => {
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
    renderFDPDocuments(fdp);
  } catch (err) {
    console.error("Failed to load LGU data:", err);
  }
});

function renderLGUHeader(lgu) {
  const headerElem = document.getElementById("lgu-header-info");
  if (headerElem) {
    headerElem.innerHTML = `
      <h1>${lgu.lgu_name}</h1>
      <p>Province of ${lgu.province} | ${lgu.region} | PSGC Code ${lgu.psgc_code}</p>
    `;
  }

  const mayorBox = document.getElementById("mayor-message-box");
  if (mayorBox && lgu.mayor) {
    mayorBox.innerHTML = `
      <p>"${lgu.mayor.message}"</p>
      <div class="executive-signature">
        — ${lgu.mayor.name}, ${lgu.mayor.title || 'Municipal Mayor'} (${lgu.mayor.term})
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
        <span class="phone-number">${h.phone}</span> (${h.landline})
      </div>
      <a href="tel:${h.phone.replace(/[^0-9+]/g, '')}" class="btn-call">CALL 24/7</a>
    </li>
  `).join("");
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
        <tr>
          <td><strong>${s.id}</strong></td>
          <td>${s.service_name}</td>
          <td>${s.office}</td>
          <td><span class="badge ${badgeClass}">${s.classification}</span></td>
          <td>${s.processing_time}</td>
          <td>${s.fees}</td>
        </tr>
      `;
    }).join("");
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
        <td><a href="${d.file_url}" target="_blank" style="color: var(--primary); font-weight: 700;">Download PDF</a></td>
      </tr>
    `).join("");
  };

  renderFDPRows(fdp.documents);
}
