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
      <p>${lgu.province}, ${lgu.region} | ${lgu.income_class} ${lgu.lgu_level}</p>
    `;
  }

  const overviewElem = document.getElementById("lgu-overview");
  if (overviewElem && lgu.overview) {
    overviewElem.innerHTML = `
      <h3>Welcome to ${lgu.lgu_name}</h3>
      <p>${lgu.overview}</p>
      ${lgu.population ? `<p><strong>Population (2020 Census):</strong> ${lgu.population.toLocaleString()}</p>` : ''}
    `;
  }

  const mayorMsg = document.getElementById("mayor-message");
  if (mayorMsg && lgu.mayor) {
    mayorMsg.innerHTML = `
      <h3>Message from ${lgu.mayor.name} (${lgu.mayor.term})</h3>
      <p>"${lgu.mayor.message}"</p>
    `;
  }
}

function renderEmergencyContacts(emergency) {
  const container = document.getElementById("emergency-contacts");
  if (!container || !emergency.hotlines) return;

  container.innerHTML = emergency.hotlines.map(h => `
    <li class="emergency-item">
      <strong>${h.agency}:</strong> 
      <span class="phone-number">${h.phone}</span> / ${h.landline}
    </li>
  `).join("");
}

function renderCitizensCharter(charter) {
  const tbody = document.getElementById("charter-table-body");
  if (!tbody || !charter.services) return;

  const renderRows = (services) => {
    tbody.innerHTML = services.map(s => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td>${s.service_name}</td>
        <td>${s.office}</td>
        <td>${s.classification}</td>
        <td>${s.processing_time}</td>
        <td>${s.fees}</td>
      </tr>
    `).join("");
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
  if (!tbody || !fdp.documents) return;

  tbody.innerHTML = fdp.documents.map(d => `
    <tr>
      <td>${d.category}</td>
      <td>${d.title}</td>
      <td>${d.publication_date}</td>
      <td><a href="${d.file_url}" target="_blank">Download PDF</a></td>
    </tr>
  `).join("");
}
