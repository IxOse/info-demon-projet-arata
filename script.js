const STORAGE = {
  demons:"infoDemonProDemonsV1",
  scientists:"infoDemonProScientistsV1",
  logs:"infoDemonProLogsV1",
  session:"infoDemonProSessionV1"
};

const grades = [
  "Scientifique en test",
  "Scientifique confirmé",
  "Scientifique chef",
  "Scientifique co-gérant",
  "Scientifique gérant",
  "Scientifique dirigeant"
];

const defaultScientists = [
  {rpName:"Narumi", steamid:"76561198000000001", discord:"Narumi", grade:"Scientifique dirigeant"},
  {rpName:"Arata", steamid:"76561198000000002", discord:"Arata", grade:"Scientifique chef"},
  {rpName:"Invité", steamid:"76561198000000003", discord:"Invite", grade:"Scientifique en test"}
];

const defaultDemons = [
  {
    nom:"Zirossi",
    pouvoir:"Résonance",
    niveau:"Puissant",
    rang:"Démon capturé",
    gerant:"Li 6",
    cogerant:"Non connu",
    proche:"Aucun",
    age:"Non renseigné",
    recherches:"Aucun",
    observations:"Démon lié aux vibrations sonores. Il doit être observé après chaque capture.",
    image:""
  },
  {
    nom:"Glace",
    pouvoir:"Cryokinésie",
    niveau:"Fort",
    rang:"Observation incomplète",
    gerant:"Inconnu",
    cogerant:"Inconnu",
    proche:"Non renseigné",
    age:"Non renseigné",
    recherches:"Non renseigné",
    observations:"Ralentit ses adversaires avec le froid. Éviter le combat prolongé.",
    image:""
  }
];

let demons = JSON.parse(localStorage.getItem(STORAGE.demons) || "null") || defaultDemons;
let scientists = JSON.parse(localStorage.getItem(STORAGE.scientists) || "null") || defaultScientists;
let logs = JSON.parse(localStorage.getItem(STORAGE.logs) || "null") || [
  {date:new Date().toLocaleString("fr-FR"), by:"Système", action:"Création du registre scientifique."}
];
let current = JSON.parse(localStorage.getItem(STORAGE.session) || "null");
let uploadedImage = "";

const q = s => document.querySelector(s);
const qq = s => document.querySelectorAll(s);

function saveAll(){
  localStorage.setItem(STORAGE.demons, JSON.stringify(demons));
  localStorage.setItem(STORAGE.scientists, JSON.stringify(scientists));
  localStorage.setItem(STORAGE.logs, JSON.stringify(logs));
  if(current) localStorage.setItem(STORAGE.session, JSON.stringify(current));
}

function toast(msg){
  const t = q("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2200);
}

function addLog(action){
  logs.unshift({date:new Date().toLocaleString("fr-FR"), by:current ? current.rpName : "Système", action});
  saveAll();
  renderLogs();
  renderStats();
}

function gradePower(grade){
  return grades.indexOf(grade);
}

function canView(){ return true; }
function canObserve(){ return current && gradePower(current.grade) >= 1; }
function canEditDemon(){ return current && gradePower(current.grade) >= 2; }
function canManageScientists(){ return current && gradePower(current.grade) >= 4; }
function canFullAdmin(){ return current && gradePower(current.grade) >= 5; }

function applySession(){
  const box = q("#sessionBox");
  const login = q("#loginPanel");
  const admin = q("#adminContent");
  const sciAdmin = q("#scientistAdminPanel");
  const danger = q("#dangerPanel");
  const demonForm = q("#demonForm");

  if(!current){
    box.innerHTML = `<b>Non connecté</b><span>Lecture publique</span>`;
    login.classList.remove("hidden");
    admin.classList.add("hidden");
    return;
  }

  box.innerHTML = `<b>${current.rpName}</b><span>${current.grade}<br>${current.steamid}</span>`;
  login.classList.add("hidden");
  admin.classList.remove("hidden");

  demonForm.classList.toggle("locked", !canEditDemon());
  sciAdmin.classList.toggle("locked", !canManageScientists());
  danger.classList.toggle("hidden", !canFullAdmin());
}

function renderStats(){
  q("#statDemons").textContent = demons.length;
  q("#statThreats").textContent = demons.filter(d => ["Puissant","Très puissant"].includes(d.niveau)).length;
  q("#statScientists").textContent = scientists.length;
  q("#statLogs").textContent = logs.length;
}

function renderDemons(){
  const search = q("#searchDemon").value.toLowerCase();
  const lvl = q("#levelFilter").value;
  const grid = q("#demonGrid");
  grid.innerHTML = "";

  demons
    .filter(d => !lvl || d.niveau === lvl)
    .filter(d => Object.values(d).join(" ").toLowerCase().includes(search))
    .forEach((d, i) => {
      const card = document.createElement("article");
      card.innerHTML = `
        <span class="badge">${d.niveau}</span>
        <h3>${d.nom}</h3>
        <p class="meta">
          Pouvoir : ${d.pouvoir || "Non renseigné"}<br>
          Gérant : ${d.gerant || "Non renseigné"}<br>
          Rang : ${d.rang || "Non renseigné"}
        </p>`;
      card.onclick = () => renderFile(i);
      grid.appendChild(card);
    });
}

function renderFile(i){
  const d = demons[i];
  const img = d.image ? `<img class="demon-img" src="${d.image}" alt="${d.nom}">` : `<div class="demon-img" style="display:grid;place-items:center;color:var(--muted)">Aucune image</div>`;
  q("#activeFile").classList.remove("empty");
  q("#activeFile").innerHTML = `
    <div class="file-layout">
      <div>${img}</div>
      <div>
        <span class="badge">${d.niveau}</span>
        <h2>${d.nom}</h2>
        <div class="field-grid">
          <div class="field"><b>Pouvoir sanguinaire</b>${d.pouvoir || "Non renseigné"}</div>
          <div class="field"><b>Rang / Statut</b>${d.rang || "Non renseigné"}</div>
          <div class="field"><b>Gérant du pouvoir</b>${d.gerant || "Non renseigné"}</div>
          <div class="field"><b>Co-gérant du pouvoir</b>${d.cogerant || "Non renseigné"}</div>
          <div class="field"><b>Démon le plus proche</b>${d.proche || "Non renseigné"}</div>
          <div class="field"><b>Âge</b>${d.age || "Non renseigné"}</div>
          <div class="field full"><b>Pourfendeurs recherchés</b>${d.recherches || "Non renseigné"}</div>
          <div class="field full"><b>Observations</b>${d.observations || "Aucune observation."}</div>
        </div>
        <div class="actions">
          <button class="btn ghost" onclick="editDemon(${i})">Modifier</button>
          <button class="btn danger" onclick="deleteDemon(${i})">Supprimer</button>
        </div>
      </div>
    </div>`;
  location.hash = "fiche";
}

function editDemon(i){
  if(!canEditDemon()) return toast("Permission refusée.");
  const d = demons[i];
  q("#editIndex").value = i;
  const form = q("#demonForm");
  ["nom","pouvoir","niveau","rang","gerant","cogerant","proche","age","recherches","observations"].forEach(k => form.elements[k].value = d[k] || "");
  uploadedImage = d.image || "";
  if(uploadedImage){
    q("#imagePreview").src = uploadedImage;
    q("#imagePreview").classList.remove("hidden");
  }
  location.hash = "admin";
  toast("Fiche chargée dans le panel.");
}

function deleteDemon(i){
  if(!canEditDemon()) return toast("Permission refusée.");
  if(confirm("Supprimer cette fiche démon ?")){
    const name = demons[i].nom;
    demons.splice(i,1);
    addLog(`Suppression de la fiche démon : ${name}.`);
    q("#activeFile").className = "file empty";
    q("#activeFile").innerHTML = `<h3>Aucune fiche sélectionnée</h3><p>Clique sur un démon dans la base.</p>`;
    renderAll();
  }
}

function renderScientists(){
  const box = q("#scientistList");
  box.innerHTML = "";
  scientists.forEach((s, i) => {
    const card = document.createElement("article");
    card.className = "scientist-card";
    card.innerHTML = `
      <div class="rank">${s.grade}</div>
      <h3>${s.rpName}</h3>
      <p class="meta">SteamID64 : ${s.steamid}<br>Discord : ${s.discord || "Non renseigné"}</p>
      <div class="actions">
        <button class="btn ghost" onclick="loadScientist(${i})">Modifier</button>
        <button class="btn danger" onclick="deleteScientist(${i})">Supprimer</button>
      </div>`;
    box.appendChild(card);
  });
}

function loadScientist(i){
  if(!canManageScientists()) return toast("Permission refusée.");
  const s = scientists[i];
  const form = q("#scientistForm");
  form.elements.rpName.value = s.rpName;
  form.elements.steamid.value = s.steamid;
  form.elements.discord.value = s.discord || "";
  form.elements.grade.value = s.grade;
  location.hash = "admin";
}

function deleteScientist(i){
  if(!canManageScientists()) return toast("Permission refusée.");
  if(scientists[i].steamid === current.steamid) return toast("Impossible de supprimer ton propre accès.");
  if(confirm("Supprimer cet accès scientifique ?")){
    addLog(`Suppression de l'accès scientifique : ${scientists[i].rpName}.`);
    scientists.splice(i,1);
    saveAll();
    renderAll();
  }
}

function renderLogs(){
  const box = q("#logList");
  box.innerHTML = "";
  logs.forEach(l => {
    const card = document.createElement("article");
    card.className = "log-card";
    card.innerHTML = `<b>${l.date} — ${l.by}</b><p>${l.action}</p>`;
    box.appendChild(card);
  });
}

q("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const steamid = new FormData(e.target).get("steamid").trim();
  const found = scientists.find(s => s.steamid === steamid);
  if(!found) return toast("SteamID64 non autorisé.");
  current = found;
  saveAll();
  applySession();
  toast("Connexion réussie.");
});

q("#logoutBtn").onclick = () => {
  current = null;
  localStorage.removeItem(STORAGE.session);
  applySession();
  toast("Déconnecté.");
};

q("#imageInput").addEventListener("change", () => {
  const file = q("#imageInput").files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage = reader.result;
    q("#imagePreview").src = uploadedImage;
    q("#imagePreview").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

q("#demonForm").addEventListener("submit", e => {
  e.preventDefault();
  if(!canEditDemon()) return toast("Permission refusée.");
  const data = Object.fromEntries(new FormData(e.target).entries());
  delete data.imageInput;
  const editIndex = data.editIndex;
  delete data.editIndex;
  data.image = uploadedImage || "";

  if(editIndex !== ""){
    demons[Number(editIndex)] = data;
    addLog(`Modification de la fiche démon : ${data.nom}.`);
  } else {
    demons.push(data);
    addLog(`Ajout de la fiche démon : ${data.nom}.`);
  }
  clearDemonForm();
  saveAll();
  renderAll();
  toast("Fiche enregistrée.");
});

function clearDemonForm(){
  q("#demonForm").reset();
  q("#editIndex").value = "";
  uploadedImage = "";
  q("#imagePreview").src = "";
  q("#imagePreview").classList.add("hidden");
}
q("#clearForm").onclick = clearDemonForm;

q("#scientistForm").addEventListener("submit", e => {
  e.preventDefault();
  if(!canManageScientists()) return toast("Permission refusée.");
  const data = Object.fromEntries(new FormData(e.target).entries());
  const existing = scientists.findIndex(s => s.steamid === data.steamid);
  if(existing >= 0){
    scientists[existing] = data;
    addLog(`Modification du scientifique : ${data.rpName}.`);
  } else {
    scientists.push(data);
    addLog(`Ajout du scientifique : ${data.rpName}.`);
  }
  e.target.reset();
  saveAll();
  renderAll();
  toast("Accès scientifique enregistré.");
});

q("#resetAll").onclick = () => {
  if(!canFullAdmin()) return toast("Permission refusée.");
  if(confirm("Réinitialiser tout le site localement ?")){
    localStorage.removeItem(STORAGE.demons);
    localStorage.removeItem(STORAGE.scientists);
    localStorage.removeItem(STORAGE.logs);
    localStorage.removeItem(STORAGE.session);
    location.reload();
  }
};

q("#searchDemon").oninput = renderDemons;
q("#levelFilter").onchange = renderDemons;

qq(".nav-link").forEach(a => a.addEventListener("click", () => {
  qq(".nav-link").forEach(x => x.classList.remove("active"));
  a.classList.add("active");
}));

function renderAll(){
  renderStats();
  renderDemons();
  renderScientists();
  renderLogs();
  applySession();
}
renderAll();
