const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const accessList = document.getElementById("accessList");
const accessForm = document.getElementById("accessForm");
const accountName = document.getElementById("accountName");
const accountRole = document.getElementById("accountRole");
const consoleOutput = document.getElementById("consoleOutput");
const consoleForm = document.getElementById("consoleForm");
const consoleInput = document.getElementById("consoleInput");
const chunkSlider = document.getElementById("chunkSlider");
const chunkValue = document.getElementById("chunkValue");
const chunkPreview = document.getElementById("chunkPreview");
const playerGrid = document.getElementById("playerGrid");
const softwareCards = document.querySelectorAll(".software-card");
const softwareValue = document.getElementById("softwareValue");
const versionValue = document.getElementById("versionValue");
const backupNowButton = document.getElementById("backupNowButton");
const createExtraBackup = document.getElementById("createExtraBackup");
const backupList = document.getElementById("backupList");
const createServerButton = document.getElementById("createServerButton");
const worldUpload = document.getElementById("worldUpload");
const uploadText = document.getElementById("uploadText");
const uploadProgress = document.getElementById("uploadProgress");
const loginOverlay = document.getElementById("loginOverlay");
const appShell = document.getElementById("appShell");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginStatus = document.getElementById("loginStatus");
const welcomeTitle = document.getElementById("welcomeTitle");
const sessionStatus = document.getElementById("sessionStatus");
const serverForm = document.getElementById("serverForm");
const serverNameInput = document.getElementById("serverNameInput");
const serverIpInput = document.getElementById("serverIpInput");
const serverRamInput = document.getElementById("serverRamInput");
const serverSlotsInput = document.getElementById("serverSlotsInput");
const serverSoftwareInput = document.getElementById("serverSoftwareInput");
const serverVersionInput = document.getElementById("serverVersionInput");
const serverNameDisplay = document.getElementById("serverNameDisplay");
const tpsDisplay = document.getElementById("tpsDisplay");
const ramDisplay = document.getElementById("ramDisplay");
const playerSlotsDisplay = document.getElementById("playerSlotsDisplay");
const serverStatusRow = document.getElementById("serverStatusRow");
const cpuDisplay = document.getElementById("cpuDisplay");
const cpuBar = document.getElementById("cpuBar");
const ramUsageDisplay = document.getElementById("ramUsageDisplay");
const ramBar = document.getElementById("ramBar");
const serverIpDisplay = document.getElementById("serverIpDisplay");

const teamMembers = [];
const players = [];
const softwareVersions = {
  Spigot: ["1.19", "1.19.2", "1.19.4", "1.20", "1.20.1", "1.20.4", "1.20.6", "1.21", "1.21.1"],
  Paper: ["1.19", "1.19.4", "1.20", "1.20.1", "1.20.4", "1.20.6", "1.21", "1.21.1"],
  Purpur: ["1.19", "1.19.4", "1.20", "1.20.1", "1.20.4", "1.20.6", "1.21", "1.21.1"],
  Fabric: ["1.19", "1.19.2", "1.19.4", "1.20", "1.20.1", "1.20.4", "1.20.6", "1.21", "1.21.1"],
  Forge: ["1.19", "1.19.2", "1.19.4", "1.20.1", "1.20.4", "1.20.6", "1.21", "1.21.1"]
};

const consoleLines = [
  "[18:02:01] [Panel/INFO]: Willkommen im SkyNode Hosting Control Panel",
  "[18:02:04] [Panel/INFO]: Noch kein Server erstellt",
  "[18:02:08] [Backup/INFO]: Automatische Backups sind vorbereitet"
];

const state = {
  loggedIn: false,
  server: null,
  account: {
    username: "",
    password: ""
  }
};

function renderTeam() {
  accessList.innerHTML = "";

  teamMembers.forEach((member) => {
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `<strong>${member.name}</strong><span>${member.role}</span>`;
    accessList.appendChild(row);
  });
}

function renderPlayers() {
  playerGrid.innerHTML = "";

  if (!state.server) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "panel player-card";
    emptyCard.innerHTML = `
      <p class="card-label">Spieler</p>
      <h4>Noch leer</h4>
      <p>Erstelle zuerst einen Server. Danach erscheinen hier deine Spieler.</p>
    `;
    playerGrid.appendChild(emptyCard);
    return;
  }

  if (players.length === 0) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "panel player-card";
    emptyCard.innerHTML = `
      <p class="card-label">Online</p>
      <h4>Noch keine Spieler online</h4>
      <p>Dein Server ist bereit. Freunde koennen jetzt beitreten.</p>
    `;
    playerGrid.appendChild(emptyCard);
  }
}

function renderConsole() {
  consoleOutput.innerHTML = "";

  consoleLines.forEach((line) => {
    const div = document.createElement("div");
    div.textContent = line;
    consoleOutput.appendChild(div);
  });

  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function populateVersions(software, preferredVersion) {
  const versions = softwareVersions[software] || [];
  serverVersionInput.innerHTML = "";

  versions.forEach((version) => {
    const option = document.createElement("option");
    option.value = version;
    option.textContent = version;
    if (version === preferredVersion) {
      option.selected = true;
    }
    serverVersionInput.appendChild(option);
  });

  const selectedVersion = preferredVersion && versions.includes(preferredVersion)
    ? preferredVersion
    : versions[versions.length - 1];

  if (selectedVersion) {
    serverVersionInput.value = selectedVersion;
  }

  versionValue.textContent = versions.length
    ? `${versions[0]} bis ${versions[versions.length - 1]}`
    : "--";
  softwareValue.textContent = selectedVersion
    ? `${software} ${selectedVersion}`
    : software;
}

function setActiveSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  navLinks.forEach((button) => {
    button.classList.toggle("active", button.dataset.sectionTarget === sectionId);
  });
}

function addBackupEntry(label) {
  const entry = document.createElement("div");
  entry.innerHTML = `<strong>${label}</strong><span>Gerade eben erstellt</span>`;
  backupList.prepend(entry);
}

function renderLoginState() {
  loginOverlay.classList.toggle("hidden", state.loggedIn);
  appShell.classList.toggle("app-shell-hidden", !state.loggedIn);
  welcomeTitle.textContent = state.account.username
    ? `Willkommen, ${state.account.username}`
    : "Willkommen";
  sessionStatus.textContent = state.account.username
    ? `Du bist als ${state.account.username} im Panel eingeloggt.`
    : "Du bist nach dem Login im Panel.";
}

function renderServerState() {
  if (!state.server) {
    serverNameDisplay.textContent = "Noch kein Server erstellt";
    tpsDisplay.textContent = "--";
    ramDisplay.textContent = "--";
    playerSlotsDisplay.textContent = "0 / 0";
    cpuDisplay.textContent = "--";
    cpuBar.style.width = "0%";
    ramUsageDisplay.textContent = "--";
    ramBar.style.width = "0%";
    serverIpDisplay.textContent = "--";
    populateVersions(serverSoftwareInput.value);
    serverStatusRow.innerHTML = `
      <span class="status-pill">Warte auf Erstellung</span>
      <span class="status-pill">Software noch offen</span>
      <span class="status-pill">Backups bereit</span>
    `;
    return;
  }

  serverNameDisplay.textContent = state.server.name;
  tpsDisplay.textContent = "20.0";
  ramDisplay.textContent = state.server.ram;
  playerSlotsDisplay.textContent = `0 / ${state.server.slots}`;
  cpuDisplay.textContent = "24%";
  cpuBar.style.width = "24%";
  ramUsageDisplay.textContent = `2.1 / ${state.server.ram}`;
  ramBar.style.width = "18%";
  serverIpDisplay.textContent = state.server.ip;
  softwareValue.textContent = `${state.server.software} ${state.server.version}`;
  serverStatusRow.innerHTML = `
    <span class="status-pill online">Online</span>
    <span class="status-pill">${state.server.software} ${state.server.version}</span>
    <span class="status-pill">${state.server.ip}</span>
  `;
}

navLinks.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.sectionTarget);
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.account.username = loginUsername.value.trim() || "Admin";
  state.account.password = loginPassword.value.trim();
  state.loggedIn = true;
  loginStatus.textContent = `Eingeloggt als ${state.account.username}`;
  if (!teamMembers.find((member) => member.name === state.account.username)) {
    teamMembers.unshift({
      name: state.account.username,
      role: "Owner"
    });
    renderTeam();
  }
  renderLoginState();
});

serverForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = serverNameInput.value.trim();
  const ip = serverIpInput.value.trim() || "play.skynode.gg";
  if (!name) {
    return;
  }

  state.server = {
    name,
    ip,
    ram: serverRamInput.value,
    slots: serverSlotsInput.value,
    software: serverSoftwareInput.value,
    version: serverVersionInput.value
  };

  consoleLines.push(`[18:14:33] [Panel/INFO]: Server ${name} wurde erstellt`);
  consoleLines.push(`[18:14:37] [Network/INFO]: Custom IP ${ip} wurde gesetzt`);
  consoleLines.push(`[18:14:41] [Server/INFO]: ${state.server.software} ${state.server.version} wurde ausgewaehlt`);
  consoleLines.push("[18:14:45] [Backup/INFO]: Start-Backup wurde vorbereitet");
  renderServerState();
  renderConsole();
  renderPlayers();
});

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = accountName.value.trim();
  if (!name) {
    return;
  }

  teamMembers.push({
    name,
    role: accountRole.value
  });

  renderTeam();
  accountName.value = "";
});

consoleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = consoleInput.value.trim();
  if (!value) {
    return;
  }

  consoleLines.push(`[18:14:33] [Server thread/INFO]: Executed command: ${value}`);
  renderConsole();
  consoleInput.value = "";
});

chunkSlider.addEventListener("input", () => {
  const value = Number(chunkSlider.value);
  chunkValue.textContent = `${value} Chunks`;
  chunkPreview.style.width = `${((value - 6) / 14) * 100}%`;
});

serverSoftwareInput.addEventListener("change", () => {
  populateVersions(serverSoftwareInput.value);
  softwareCards.forEach((item) => {
    item.classList.toggle("active", item.dataset.software === serverSoftwareInput.value);
  });
});

serverVersionInput.addEventListener("change", () => {
  softwareValue.textContent = `${serverSoftwareInput.value} ${serverVersionInput.value}`;
});

softwareCards.forEach((card) => {
  card.addEventListener("click", () => {
    softwareCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    serverSoftwareInput.value = card.dataset.software;
    populateVersions(card.dataset.software);
  });
});

backupNowButton.addEventListener("click", () => {
  addBackupEntry("Sofort Backup");
});

createExtraBackup.addEventListener("click", () => {
  addBackupEntry("Manuelles Backup");
});

createServerButton.addEventListener("click", () => {
  setActiveSection("overview");
  serverNameInput.focus();
});

worldUpload.addEventListener("change", () => {
  const file = worldUpload.files[0];
  if (!file) {
    return;
  }

  const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
  uploadProgress.style.width = "100%";
  uploadText.textContent = `${file.name} wurde ausgewaehlt (${sizeInMb} MB). Bereit fuer den Import.`;
});

renderTeam();
renderPlayers();
renderConsole();
renderServerState();
renderLoginState();
populateVersions(serverSoftwareInput.value, "1.21.1");
