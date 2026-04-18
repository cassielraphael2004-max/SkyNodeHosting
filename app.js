const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const accessList = document.getElementById("accessList");
const accessForm = document.getElementById("accessForm");
const accountName = document.getElementById("accountName");
const accountRole = document.getElementById("accountRole");
const consoleOutput = document.getElementById("consoleOutput");
const consoleForm = document.getElementById("consoleForm");
const consoleInput = document.getElementById("consoleInput");
const playerGrid = document.getElementById("playerGrid");
const softwareCards = document.querySelectorAll(".software-card");
const softwareValue = document.getElementById("softwareValue");
const versionValue = document.getElementById("versionValue");
const backupNowButton = document.getElementById("backupNowButton");
const createExtraBackup = document.getElementById("createExtraBackup");
const backupList = document.getElementById("backupList");
const createServerButton = document.getElementById("createServerButton");
const serverMenuButton = document.getElementById("serverMenuButton");
const serverMenu = document.getElementById("serverMenu");
const serverMenuList = document.getElementById("serverMenuList");
const newServerMenuButton = document.getElementById("newServerMenuButton");
const startServerButton = document.getElementById("startServerButton");
const restartServerButton = document.getElementById("restartServerButton");
const stopServerButton = document.getElementById("stopServerButton");
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
const playersValue = document.getElementById("playersValue");
const playerOptionMeta = document.getElementById("playerOptionMeta");
const playerOptionSummary = document.getElementById("playerOptionSummary");
const playersMinusButton = document.getElementById("playersMinusButton");
const playersPlusButton = document.getElementById("playersPlusButton");
const spawnProtectionValue = document.getElementById("spawnProtectionValue");
const spawnProtectionMeta = document.getElementById("spawnProtectionMeta");
const spawnProtectionSummary = document.getElementById("spawnProtectionSummary");
const spawnProtectionMinusButton = document.getElementById("spawnProtectionMinusButton");
const spawnProtectionPlusButton = document.getElementById("spawnProtectionPlusButton");
const gamemodeSelect = document.getElementById("gamemodeSelect");
const gamemodeMeta = document.getElementById("gamemodeMeta");
const difficultySelect = document.getElementById("difficultySelect");
const difficultyMeta = document.getElementById("difficultyMeta");
const resourcePackInput = document.getElementById("resourcePackInput");
const resourcePackMeta = document.getElementById("resourcePackMeta");
const resourcePromptInput = document.getElementById("resourcePromptInput");
const resourcePromptMeta = document.getElementById("resourcePromptMeta");
const toggleBoxes = document.querySelectorAll(".toggle-box");

const teamMembers = [
  { name: "Marley", role: "Admin" },
  { name: "Julius", role: "Admin" }
];
const players = [];
const accounts = {
  leon: { password: "SkyNodeHostingLeon", role: "Owner", displayName: "leon" },
  marley: { password: "SkyNodeMarley", role: "Admin", displayName: "Marley" },
  julius: { password: "SkyNodeJulius", role: "Admin", displayName: "Julius" }
};
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
  servers: [],
  activeServerId: null,
  account: {
    username: "",
    password: ""
  }
};

function getActiveServer() {
  return state.servers.find((server) => server.id === state.activeServerId) || null;
}

function buildServerIp(name) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return `${slug || "server"}.skynode.host`;
}

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

  if (!getActiveServer()) {
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

function updateServerControls() {
  const activeServer = getActiveServer();
  const hasServer = Boolean(activeServer);
  const isOnline = hasServer && activeServer.status === "online";

  startServerButton.disabled = !hasServer || isOnline;
  restartServerButton.disabled = !hasServer || !isOnline;
  stopServerButton.disabled = !hasServer || !isOnline;
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

function renderServerMenu() {
  const activeServer = getActiveServer();
  serverMenuButton.textContent = activeServer ? `Server: ${activeServer.name}` : "Server";
  serverMenuList.innerHTML = "";

  if (state.servers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "server-menu-item";
    empty.innerHTML = "<span>Noch keine Server erstellt</span>";
    serverMenuList.appendChild(empty);
    return;
  }

  state.servers.forEach((server) => {
    const item = document.createElement("div");
    item.className = `server-menu-item${server.id === state.activeServerId ? " active" : ""}`;
    item.innerHTML = `
      <div>
        <strong>${server.name}</strong>
        <span>${server.status === "online" ? "Online" : "Offline"} • ${server.software} ${server.version}</span>
      </div>
      <div class="server-menu-actions">
        <button class="icon-button" data-server-select="${server.id}" type="button">→</button>
        <button class="icon-button danger" data-server-delete="${server.id}" type="button">×</button>
      </div>
    `;
    serverMenuList.appendChild(item);
  });
}

function renderServerState() {
  const activeServer = getActiveServer();

  if (!activeServer) {
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
    updateServerControls();
    renderServerMenu();
    return;
  }

  serverNameDisplay.textContent = activeServer.name;
  tpsDisplay.textContent = activeServer.status === "online" ? "20.0" : "0.0";
  ramDisplay.textContent = activeServer.ram;
  playerSlotsDisplay.textContent = `0 / ${activeServer.slots}`;
  cpuDisplay.textContent = activeServer.status === "online" ? "24%" : "0%";
  cpuBar.style.width = activeServer.status === "online" ? "24%" : "0%";
  ramUsageDisplay.textContent = activeServer.status === "online" ? `2.1 / ${activeServer.ram}` : `0 / ${activeServer.ram}`;
  ramBar.style.width = activeServer.status === "online" ? "18%" : "0%";
  serverIpDisplay.textContent = activeServer.ip;
  softwareValue.textContent = `${activeServer.software} ${activeServer.version}`;
  serverStatusRow.innerHTML = activeServer.status === "online"
    ? `
      <span class="status-pill online">Online</span>
      <span class="status-pill">${activeServer.software} ${activeServer.version}</span>
      <span class="status-pill">${activeServer.ip}</span>
    `
    : `
      <span class="status-pill">Offline</span>
      <span class="status-pill">${activeServer.software} ${activeServer.version}</span>
      <span class="status-pill">${activeServer.ip}</span>
    `;
  updateServerControls();
  renderServerMenu();
}

function updatePlayerOption(delta) {
  const current = Number(playersValue.textContent);
  const next = Math.min(200, Math.max(1, current + delta));
  playersValue.textContent = String(next);
  playerOptionMeta.textContent = String(next);
  playerOptionSummary.textContent = String(next);
}

function updateSpawnProtection(delta) {
  const current = Number(spawnProtectionValue.textContent);
  const next = Math.min(32, Math.max(0, current + delta));
  spawnProtectionValue.textContent = String(next);
  spawnProtectionMeta.textContent = String(next);
  spawnProtectionSummary.textContent = String(next);
}

navLinks.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.sectionTarget);
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = loginUsername.value.trim().toLowerCase();
  const password = loginPassword.value.trim();
  const account = accounts[username];

  if (!account || account.password !== password) {
    loginStatus.textContent = "Login fehlgeschlagen. Bitte pruefe Benutzername und Passwort.";
    return;
  }

  state.account.username = account.displayName;
  state.account.password = password;
  state.loggedIn = true;
  loginStatus.textContent = `Eingeloggt als ${state.account.username}`;
  if (!teamMembers.find((member) => member.name === state.account.username)) {
    teamMembers.unshift({
      name: state.account.username,
      role: account.role
    });
    renderTeam();
  }
  renderLoginState();
});

serverForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = serverNameInput.value.trim();
  if (!name) {
    return;
  }
  const ip = buildServerIp(name);

  const newServer = {
    id: `server-${Date.now()}`,
    name,
    ip,
    ram: serverRamInput.value,
    slots: serverSlotsInput.value,
    software: serverSoftwareInput.value,
    version: serverVersionInput.value,
    status: "offline"
  };
  state.servers.push(newServer);
  state.activeServerId = newServer.id;

  consoleLines.push(`[18:14:33] [Panel/INFO]: Server ${name} wurde erstellt`);
  consoleLines.push(`[18:14:37] [Network/INFO]: Server-IP ${ip} wurde automatisch erstellt`);
  consoleLines.push(`[18:14:41] [Server/INFO]: ${newServer.software} ${newServer.version} wurde ausgewaehlt`);
  consoleLines.push("[18:14:45] [Server/INFO]: Server wurde angelegt und wartet auf Start");
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

playersMinusButton.addEventListener("click", () => updatePlayerOption(-1));
playersPlusButton.addEventListener("click", () => updatePlayerOption(1));
spawnProtectionMinusButton.addEventListener("click", () => updateSpawnProtection(-1));
spawnProtectionPlusButton.addEventListener("click", () => updateSpawnProtection(1));

gamemodeSelect.addEventListener("change", () => {
  gamemodeMeta.textContent = gamemodeSelect.value;
});

difficultySelect.addEventListener("change", () => {
  difficultyMeta.textContent = difficultySelect.value;
});

resourcePackInput.addEventListener("input", () => {
  resourcePackMeta.textContent = resourcePackInput.value.trim() || "-";
});

resourcePromptInput.addEventListener("input", () => {
  resourcePromptMeta.textContent = resourcePromptInput.value.trim() || "-";
});

toggleBoxes.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.toggleTarget);
    const isOn = button.classList.contains("on");
    button.classList.toggle("on", !isOn);
    button.classList.toggle("off", isOn);
    button.textContent = isOn ? "X" : "✓";
    target.textContent = isOn ? "false" : "true";
  });
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

serverMenuButton.addEventListener("click", () => {
  serverMenu.classList.toggle("hidden");
});

newServerMenuButton.addEventListener("click", () => {
  serverMenu.classList.add("hidden");
  setActiveSection("overview");
  serverNameInput.focus();
});

serverMenuList.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-server-select]");
  const deleteButton = event.target.closest("[data-server-delete]");

  if (selectButton) {
    state.activeServerId = selectButton.dataset.serverSelect;
    serverMenu.classList.add("hidden");
    renderServerState();
    renderPlayers();
  }

  if (deleteButton) {
    const serverId = deleteButton.dataset.serverDelete;
    const serverToDelete = state.servers.find((server) => server.id === serverId);
    state.servers = state.servers.filter((server) => server.id !== serverId);

    if (state.activeServerId === serverId) {
      state.activeServerId = state.servers[0]?.id || null;
    }

    if (serverToDelete) {
      consoleLines.push(`[18:24:17] [Panel/INFO]: Server ${serverToDelete.name} wurde geloescht`);
      renderConsole();
    }

    renderServerState();
    renderPlayers();
  }
});

startServerButton.addEventListener("click", () => {
  const activeServer = getActiveServer();
  if (!activeServer || activeServer.status === "online") {
    return;
  }

  activeServer.status = "online";
  consoleLines.push(`[18:20:03] [Server/INFO]: ${activeServer.name} wurde gestartet`);
  consoleLines.push("[18:20:08] [Backup/INFO]: Start-Backup wurde erstellt");
  addBackupEntry("Start Backup");
  renderServerState();
  renderConsole();
});

restartServerButton.addEventListener("click", () => {
  const activeServer = getActiveServer();
  if (!activeServer || activeServer.status !== "online") {
    return;
  }

  consoleLines.push(`[18:21:11] [Server/INFO]: ${activeServer.name} wird neugestartet`);
  consoleLines.push("[18:21:16] [Server/INFO]: Neustart erfolgreich abgeschlossen");
  consoleLines.push("[18:21:18] [Backup/INFO]: Neustart-Backup wurde erstellt");
  addBackupEntry("Neustart Backup");
  renderServerState();
  renderConsole();
});

stopServerButton.addEventListener("click", () => {
  const activeServer = getActiveServer();
  if (!activeServer || activeServer.status !== "online") {
    return;
  }

  activeServer.status = "offline";
  consoleLines.push(`[18:22:07] [Server/INFO]: ${activeServer.name} wurde gestoppt`);
  renderServerState();
  renderConsole();
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
