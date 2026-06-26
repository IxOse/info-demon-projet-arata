const demons = [
  {nom:'demon-flamme-spectrale', pouvoir:'Flamme spectrale', niveau:'Dangereux', zone:'Village brûlé'},
  {nom:'demon-ronce', pouvoir:'Ronces', niveau:'Moyen', zone:'Forêt Nord'},
  {nom:'demon-acide', pouvoir:'Acide', niveau:'Très dangereux', zone:'Grotte humide'},
  {nom:'demon-sang', pouvoir:'Manipulation du sang', niveau:'Dangereux', zone:'Temple abandonné'},
  {nom:'demon-resonance', pouvoir:'Résonance', niveau:'Très dangereux', zone:'Forêt Sélection'},
  {nom:'demon-glace', pouvoir:'Glace', niveau:'Moyen', zone:'Montagne'},
  {nom:'demon-sombre-eclair', pouvoir:'Ombre & éclair', niveau:'Priorité absolue', zone:'Château de Kurayami'}
];
const grid=document.querySelector('#demonGrid'), search=document.querySelector('#search'), filter=document.querySelector('#filter');
function render(){const q=(search.value||'').toLowerCase(), f=filter.value;grid.innerHTML='';demons.filter(d=>(f==='all'||d.niveau===f)&&[d.nom,d.pouvoir,d.niveau,d.zone].join(' ').toLowerCase().includes(q)).forEach(d=>{grid.innerHTML+=`<article class="demon-card"><span class="tag">${d.niveau}</span><h3>${d.nom}</h3><p><b>Pouvoir :</b> ${d.pouvoir}</p><p><b>Dernière zone :</b> ${d.zone}</p></article>`})}
search.addEventListener('input',render);filter.addEventListener('change',render);render();
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.querySelector('#countDemons').textContent=demons.length;
