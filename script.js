let demons = JSON.parse(localStorage.getItem('demons_final_simple')||'null') || [
  {nom:'Zirossi',pouvoir:'Résonance',niveau:'Puissant',rang:'Capturé',gerant:'Li 6',cogerant:'Inconnu',proche:'Aucun',age:'Non renseigné',recherches:'Aucun',observations:'Démon lié aux vibrations sonores.',image:''}
];

let logs = JSON.parse(localStorage.getItem('logs_final_simple')||'null') || [];
let imageData = '';

function save(){
  localStorage.setItem('demons_final_simple',JSON.stringify(demons));
  localStorage.setItem('logs_final_simple',JSON.stringify(logs));
}

function addLog(txt){
  logs.unshift({date:new Date().toLocaleString('fr-FR'),txt});
  save();
  renderLogs();
  renderStats();
}

function renderStats(){
  countDemons.textContent = demons.length;
  countLogs.textContent = logs.length;
}

function renderDemons(){
  const s = search.value.toLowerCase();
  const f = filter.value;
  demonGrid.innerHTML = '';

  demons
    .filter(d => (!f || d.niveau === f) && Object.values(d).join(' ').toLowerCase().includes(s))
    .forEach((d,i)=>{
      const el = document.createElement('article');
      el.innerHTML = `<span class="badge">${d.niveau}</span><h3>${d.nom}</h3><p>Pouvoir : ${d.pouvoir || 'Non renseigné'}<br>Gérant : ${d.gerant || 'Non renseigné'}<br>Rang : ${d.rang || 'Non renseigné'}</p>`;
      el.onclick = () => showFiche(i);
      demonGrid.appendChild(el);
    });
}

function showFiche(i){
  const d = demons[i];
  ficheContent.classList.remove('empty');
  ficheContent.innerHTML = `
    ${d.image ? `<img class="demonimg" src="${d.image}">` : ''}
    <h2>${d.nom}</h2>
    <span class="badge">${d.niveau}</span>
    <div class="fields">
      <div class="field"><b>Pouvoir sanguinaire</b>${d.pouvoir || 'Non renseigné'}</div>
      <div class="field"><b>Rang / Statut</b>${d.rang || 'Non renseigné'}</div>
      <div class="field"><b>Gérant du pouvoir</b>${d.gerant || 'Non renseigné'}</div>
      <div class="field"><b>Co-gérant du pouvoir</b>${d.cogerant || 'Non renseigné'}</div>
      <div class="field"><b>Démon le plus proche</b>${d.proche || 'Non renseigné'}</div>
      <div class="field"><b>Âge</b>${d.age || 'Non renseigné'}</div>
      <div class="field full"><b>Pourfendeurs recherchés</b>${d.recherches || 'Non renseigné'}</div>
      <div class="field full"><b>Observations</b>${d.observations || 'Aucune observation'}</div>
    </div>
    <br>
    <button onclick="editDemon(${i})">Modifier</button>
    <br><br>
    <button class="danger" onclick="deleteDemon(${i})">Supprimer</button>`;
  location.hash = 'fiche';
}

function editDemon(i){
  const d = demons[i];
  editIndex.value = i;
  ['nom','pouvoir','niveau','rang','gerant','cogerant','proche','age','recherches','observations'].forEach(k=>{
    demonForm.elements[k].value = d[k] || '';
  });
  imageData = d.image || '';
  if(imageData){
    preview.src = imageData;
    preview.classList.remove('hidden');
  }
  location.hash = 'admin';
}

function deleteDemon(i){
  if(confirm('Supprimer cette fiche ?')){
    const name = demons[i].nom;
    demons.splice(i,1);
    addLog('Suppression du démon : '+name);
    renderAll();
  }
}

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageData = reader.result;
    preview.src = imageData;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
};

demonForm.onsubmit = e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const i = data.editIndex;
  delete data.editIndex;
  data.image = imageData;

  if(i === ''){
    demons.push(data);
    addLog('Ajout du démon : '+data.nom);
  }else{
    demons[Number(i)] = data;
    addLog('Modification du démon : '+data.nom);
  }

  clear();
  save();
  renderAll();
  location.hash = 'demons';
};

function clear(){
  demonForm.reset();
  editIndex.value = '';
  imageData = '';
  preview.src = '';
  preview.classList.add('hidden');
}

clearForm.onclick = clear;

resetAll.onclick = () => {
  if(confirm('Réinitialiser toutes les fiches ?')){
    localStorage.removeItem('demons_final_simple');
    localStorage.removeItem('logs_final_simple');
    location.reload();
  }
};

function renderLogs(){
  logList.innerHTML = '';
  logs.forEach(l=>{
    const d = document.createElement('div');
    d.innerHTML = `<b>${l.date}</b><br>${l.txt}`;
    logList.appendChild(d);
  });
}

search.oninput = renderDemons;
filter.onchange = renderDemons;

function renderAll(){
  renderStats();
  renderDemons();
  renderLogs();
}

renderAll();
