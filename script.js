const GRADE = [
 'Scientifique en test',
 'Scientifique confirmé',
 'Scientifique chef',
 'Scientifique co-gérant',
 'Scientifique gérant',
 'Scientifique dirigeant'
];

let demons = JSON.parse(localStorage.getItem('demons_clean')||'null') || [
 {nom:'Zirossi',pouvoir:'Résonance',niveau:'Puissant',rang:'Capturé',gerant:'Li 6',cogerant:'Inconnu',proche:'Aucun',age:'Non renseigné',recherches:'Aucun',observations:'Démon lié aux vibrations sonores.',image:''}
];
let scientists = JSON.parse(localStorage.getItem('scientists_clean')||'null') || [
 {nom:'Narumi',steamid:'76561198000000001',discord:'Narumi',grade:'Scientifique dirigeant'},
 {nom:'Arata',steamid:'76561198000000002',discord:'Arata',grade:'Scientifique chef'}
];
let logs = JSON.parse(localStorage.getItem('logs_clean')||'null') || [];
let session = JSON.parse(localStorage.getItem('session_clean')||'null');
let imageData = '';

function save(){
 localStorage.setItem('demons_clean',JSON.stringify(demons));
 localStorage.setItem('scientists_clean',JSON.stringify(scientists));
 localStorage.setItem('logs_clean',JSON.stringify(logs));
 if(session)localStorage.setItem('session_clean',JSON.stringify(session));
}
function power(){return session?GRADE.indexOf(session.grade):-1}
function canEdit(){return power()>=2}
function canManage(){return power()>=4}
function log(txt){logs.unshift({date:new Date().toLocaleString('fr-FR'),by:session?session.nom:'Système',txt});save();renderLogs();renderStats()}
function renderStats(){countDemons.textContent=demons.length;countScientists.textContent=scientists.length;countLogs.textContent=logs.length}
function renderSession(){
 sessionBox=document.getElementById('session');
 if(!session){sessionBox.innerHTML='Non connecté';loginBox.classList.remove('hidden');adminBox.classList.add('hidden');return}
 sessionBox.innerHTML='<b>'+session.nom+'</b><br>'+session.grade+'<br>'+session.steamid;
 loginBox.classList.add('hidden');adminBox.classList.remove('hidden');
 document.getElementById('scientistAdmin').classList.toggle('hidden',!canManage());
}
function renderDemons(){
 const s=document.getElementById('search').value.toLowerCase();
 const f=document.getElementById('filter').value;
 demonGrid.innerHTML='';
 demons.filter(d=>(!f||d.niveau==f)&&Object.values(d).join(' ').toLowerCase().includes(s)).forEach((d,i)=>{
  const el=document.createElement('article');
  el.innerHTML='<span class="badge">'+d.niveau+'</span><h3>'+d.nom+'</h3><p>Pouvoir : '+d.pouvoir+'<br>Gérant : '+(d.gerant||'')+'<br>Rang : '+(d.rang||'')+'</p>';
  el.onclick=()=>showFiche(i);
  demonGrid.appendChild(el);
 });
}
function showFiche(i){
 const d=demons[i];
 ficheContent.classList.remove('empty');
 ficheContent.innerHTML=(d.image?'<img class="demonimg" src="'+d.image+'">':'')+'<h2>'+d.nom+'</h2><span class="badge">'+d.niveau+'</span><div class="fields">'+
 ['pouvoir','rang','gerant','cogerant','proche','age','recherches','observations'].map(k=>'<div class="field '+(k=='observations'||k=='recherches'?'full':'')+'"><b>'+k+'</b>'+(d[k]||'Non renseigné')+'</div>').join('')+
 '</div><br><button onclick="editDemon('+i+')">Modifier</button><br><br><button onclick="deleteDemon('+i+')">Supprimer</button>';
 location.hash='fiche';
}
function editDemon(i){
 if(!canEdit())return alert('Permission refusée');
 const d=demons[i], form=demonForm;
 editIndex.value=i;
 ['nom','pouvoir','niveau','rang','gerant','cogerant','proche','age','recherches','observations'].forEach(k=>form.elements[k].value=d[k]||'');
 imageData=d.image||'';
 if(imageData){preview.src=imageData;preview.classList.remove('hidden')}
 location.hash='admin';
}
function deleteDemon(i){
 if(!canEdit())return alert('Permission refusée');
 if(confirm('Supprimer cette fiche ?')){let n=demons[i].nom;demons.splice(i,1);log('Suppression démon : '+n);renderAll()}
}
loginForm.onsubmit=e=>{
 e.preventDefault();
 const id=new FormData(e.target).get('steamid').trim();
 const found=scientists.find(s=>s.steamid==id);
 if(!found)return alert('SteamID non autorisé');
 session=found;save();renderSession();
}
logout.onclick=()=>{session=null;localStorage.removeItem('session_clean');renderSession()}
imageInput.onchange=()=>{
 const file=imageInput.files[0]; if(!file)return;
 const r=new FileReader(); r.onload=()=>{imageData=r.result;preview.src=imageData;preview.classList.remove('hidden')}; r.readAsDataURL(file);
}
demonForm.onsubmit=e=>{
 e.preventDefault(); if(!canEdit())return alert('Permission refusée');
 const data=Object.fromEntries(new FormData(e.target).entries());
 const i=data.editIndex; delete data.editIndex; data.image=imageData;
 if(i===''){demons.push(data);log('Ajout démon : '+data.nom)}else{demons[Number(i)]=data;log('Modification démon : '+data.nom)}
 clear();save();renderAll();location.hash='demons';
}
function clear(){demonForm.reset();editIndex.value='';imageData='';preview.classList.add('hidden')}
clearForm.onclick=clear;
scientistForm.onsubmit=e=>{
 e.preventDefault(); if(!canManage())return alert('Permission refusée');
 const data=Object.fromEntries(new FormData(e.target).entries());
 const i=scientists.findIndex(s=>s.steamid==data.steamid);
 if(i>=0)scientists[i]=data; else scientists.push(data);
 log('Accès scientifique : '+data.nom);e.target.reset();renderAll();
}
function renderScientists(){
 scientistList.innerHTML='';
 scientists.forEach(s=>{let el=document.createElement('article');el.innerHTML='<span class="badge">'+s.grade+'</span><h3>'+s.nom+'</h3><p>SteamID64 : '+s.steamid+'<br>Discord : '+(s.discord||'')+'</p>';scientistList.appendChild(el)})
}
function renderLogs(){logList.innerHTML='';logs.forEach(l=>{let d=document.createElement('div');d.innerHTML='<b>'+l.date+' — '+l.by+'</b><br>'+l.txt;logList.appendChild(d)})}
search.oninput=renderDemons;filter.onchange=renderDemons;
function renderAll(){renderStats();renderSession();renderDemons();renderScientists();renderLogs()}
renderAll();
