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
    recherches:"Aucun pourfendeur recherché",
    croquis:"",
    observations:"Démon lié aux vibrations sonores. Il doit être observé après chaque capture pour vérifier son évolution."
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
    croquis:"",
    observations:"Démon capable de ralentir ses adversaires avec le froid."
  }
];

let demons = JSON.parse(localStorage.getItem("infoDemonV5") || "null") || defaultDemons;
let journal = JSON.parse(localStorage.getItem("infoDemonJournalV5") || "null") || [
  {date:"26/06", titre:"Registre créé", texte:"Ouverture du Projet Info Démon."}
];

const grid = document.querySelector("#demonGrid");
const fiche = document.querySelector("#fiche");
const search = document.querySelector("#search");
const filter = document.querySelector("#filterDanger");

function save(){
  localStorage.setItem("infoDemonV5", JSON.stringify(demons));
  localStorage.setItem("infoDemonJournalV5", JSON.stringify(journal));
}

function renderStats(){
  document.querySelector("#statTotal").textContent = demons.length;
  document.querySelector("#statDanger").textContent = demons.filter(d => ["Fort","Puissant","Très puissant"].includes(d.niveau)).length;
  document.querySelector("#statPouvoirs").textContent = new Set(demons.map(d => d.pouvoir)).size;
  document.querySelector("#statJournal").textContent = journal.length;
}

function renderDemons(){
  const q = search.value.toLowerCase();
  const f = filter.value;
  grid.innerHTML = "";
  demons
    .filter(d => !f || d.niveau === f)
    .filter(d => Object.values(d).join(" ").toLowerCase().includes(q))
    .forEach((d,i)=>{
      const card=document.createElement("article");
      card.innerHTML=`
        <span class="badge">${d.niveau}</span>
        <h3>${d.nom}</h3>
        <p class="meta">
          Pouvoir : ${d.pouvoir || "Non renseigné"}<br>
          Rang : ${d.rang || "Non renseigné"}<br>
          Gérant : ${d.gerant || "Non renseigné"}
        </p>`;
      card.onclick=()=>renderFiche(i);
      grid.appendChild(card);
    });
}

function renderFiche(i){
  const d = demons[i];
  fiche.classList.remove("empty");
  const img = d.croquis && d.croquis.startsWith("http") ? `<img class="preview" src="${d.croquis}" alt="Croquis du démon">` : (d.croquis || "Aucun croquis");
  fiche.innerHTML = `
    <span class="badge">${d.niveau}</span>
    <h2>${d.nom}</h2>
    <div class="fiche-grid">
      <div class="field"><b>Pouvoir sanguinaire</b>${d.pouvoir || "Non renseigné"}</div>
      <div class="field"><b>Niveau</b>${d.niveau || "Non renseigné"}</div>
      <div class="field"><b>Rang / Statut</b>${d.rang || "Non renseigné"}</div>
      <div class="field"><b>Gérant du pouvoir</b>${d.gerant || "Non renseigné"}</div>
      <div class="field"><b>Co-gérant du pouvoir</b>${d.cogerant || "Non renseigné"}</div>
      <div class="field"><b>Démon le plus proche</b>${d.proche || "Non renseigné"}</div>
      <div class="field"><b>Âge</b>${d.age || "Non renseigné"}</div>
      <div class="field"><b>Pourfendeurs recherchés</b>${d.recherches || "Non renseigné"}</div>
      <div class="field full"><b>Observations</b>${d.observations || "Aucune observation."}</div>
      <div class="field full"><b>Croquis / image</b>${img}</div>
    </div>
    <button class="btn ghost" onclick="deleteDemon(${i})" style="margin-top:16px">Supprimer cette fiche</button>
  `;
  location.hash = "fiches";
}

function deleteDemon(i){
  if(confirm("Supprimer cette fiche démon ?")){
    const name = demons[i].nom;
    demons.splice(i,1);
    journal.unshift({date:new Date().toLocaleDateString("fr-FR"),titre:"Fiche supprimée",texte:`Suppression de la fiche ${name}.`});
    save();
    fiche.className="fiche empty";
    fiche.innerHTML="<h3>Aucune fiche sélectionnée</h3><p>Clique sur un démon dans la liste.</p>";
    renderAll();
  }
}

function renderJournal(){
  const box=document.querySelector("#journalList");
  box.innerHTML="";
  journal.forEach(j=>{
    const a=document.createElement("article");
    a.innerHTML=`<b>${j.date} — ${j.titre}</b><p>${j.texte}</p>`;
    box.appendChild(a);
  });
}

document.querySelector("#adminForm").addEventListener("submit", e=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  demons.push(data);
  journal.unshift({date:new Date().toLocaleDateString("fr-FR"),titre:"Nouvelle fiche",texte:`Ajout de ${data.nom} dans les archives.`});
  save();
  e.target.reset();
  renderAll();
  alert("Fiche ajoutée !");
  location.hash = "demons";
});

document.querySelector("#resetData").onclick=()=>{
  if(confirm("Tout réinitialiser ?")){
    localStorage.removeItem("infoDemonV5");
    localStorage.removeItem("infoDemonJournalV5");
    demons=[...defaultDemons];
    journal=[{date:"26/06", titre:"Registre créé", texte:"Ouverture du Projet Info Démon."}];
    save();
    renderAll();
  }
};

search.oninput=renderDemons;
filter.onchange=renderDemons;

function renderAll(){renderStats();renderDemons();renderJournal();}
renderAll();
