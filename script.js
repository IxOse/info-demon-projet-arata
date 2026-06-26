const defaultDemons = [
  {
    nom:"Zirossi",
    pouvoir:"Résonance",
    danger:"Dangereux",
    zone:"Forêt Sélection",
    rang:"Démon capturé",
    notes:"Utilise des vibrations sonores. Aucun démon proche connu. Pouvoir lié à la résonance."
  },
  {
    nom:"Flamme Spectrale",
    pouvoir:"Flamme maudite",
    danger:"Très dangereux",
    zone:"Village abandonné",
    rang:"Menace active",
    notes:"Attaques à moyenne distance. Faiblesse supposée : eau et attaque rapide."
  },
  {
    nom:"Glace",
    pouvoir:"Cryokinésie",
    danger:"Moyen",
    zone:"Montagne Nord",
    rang:"Observation incomplète",
    notes:"Ralentit ses adversaires avec le froid. Éviter le combat prolongé."
  },
  {
    nom:"Sombre-Éclair",
    pouvoir:"Foudre noire",
    danger:"Priorité absolue",
    zone:"Château de Kurayami",
    rang:"Non capturé",
    notes:"Déplacement extrêmement rapide. Intervention gradée recommandée."
  }
];

const defaultJournal = [
  {date:"26/06", titre:"Création du registre", texte:"Mise en place de la base Info Démon."},
  {date:"26/06", titre:"Fiche Zirossi", texte:"Première fiche complète ajoutée au registre."}
];

let demons = JSON.parse(localStorage.getItem("infoDemonData") || "null") || defaultDemons;
let journal = JSON.parse(localStorage.getItem("infoDemonJournal") || "null") || defaultJournal;

const grid = document.querySelector("#demonGrid");
const fiche = document.querySelector("#fiche");
const search = document.querySelector("#search");
const filterDanger = document.querySelector("#filterDanger");

function save(){
  localStorage.setItem("infoDemonData", JSON.stringify(demons));
  localStorage.setItem("infoDemonJournal", JSON.stringify(journal));
}

function renderStats(){
  document.querySelector("#statTotal").textContent = demons.length;
  document.querySelector("#statDanger").textContent = demons.filter(d => ["Dangereux","Très dangereux","Priorité absolue"].includes(d.danger)).length;
  document.querySelector("#statPouvoirs").textContent = new Set(demons.map(d => d.pouvoir)).size;
  document.querySelector("#statJournal").textContent = journal.length;
}

function renderDemons(){
  const q = search.value.toLowerCase();
  const fd = filterDanger.value;
  grid.innerHTML = "";
  demons
    .filter(d => !fd || d.danger === fd)
    .filter(d => Object.values(d).join(" ").toLowerCase().includes(q))
    .forEach((d, i) => {
      const card = document.createElement("article");
      card.innerHTML = `
        <span class="badge">${d.danger}</span>
        <h3>${d.nom}</h3>
        <p class="meta">Pouvoir : ${d.pouvoir}<br>Zone : ${d.zone}<br>Statut : ${d.rang}</p>
      `;
      card.onclick = () => renderFiche(i);
      grid.appendChild(card);
    });
}

function renderFiche(i){
  const d = demons[i];
  fiche.classList.remove("empty");
  fiche.innerHTML = `
    <span class="badge">${d.danger}</span>
    <h2>${d.nom}</h2>
    <div class="fiche-grid">
      <div class="field"><b>Pouvoir sanguinaire</b>${d.pouvoir}</div>
      <div class="field"><b>Dangerosité</b>${d.danger}</div>
      <div class="field"><b>Dernière localisation</b>${d.zone || "Non renseignée"}</div>
      <div class="field"><b>Rang / Statut</b>${d.rang || "Non renseigné"}</div>
      <div class="field" style="grid-column:1/-1"><b>Observations</b>${d.notes || "Aucune observation."}</div>
    </div>
  `;
  location.hash = "fiches";
}

function renderJournal(){
  const box = document.querySelector("#journalList");
  box.innerHTML = "";
  journal.forEach(j => {
    const a = document.createElement("article");
    a.innerHTML = `<b>${j.date} — ${j.titre}</b><p>${j.texte}</p>`;
    box.appendChild(a);
  });
}

document.querySelector("#adminForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  demons.push(data);
  journal.unshift({date:new Date().toLocaleDateString("fr-FR"), titre:"Nouvelle fiche ajoutée", texte:`Fiche de ${data.nom} ajoutée au registre.`});
  save();
  e.target.reset();
  renderAll();
  alert("Fiche ajoutée !");
});

document.querySelector("#resetData").onclick = () => {
  if(confirm("Réinitialiser toutes les données ?")){
    localStorage.removeItem("infoDemonData");
    localStorage.removeItem("infoDemonJournal");
    demons = defaultDemons;
    journal = defaultJournal;
    renderAll();
  }
};

search.oninput = renderDemons;
filterDanger.onchange = renderDemons;

function renderAll(){
  renderStats();
  renderDemons();
  renderJournal();
}
renderAll();