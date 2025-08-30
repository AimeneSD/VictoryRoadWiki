console.log("characters.js loaded");

const filterbtn = document.querySelectorAll('.filter-options label');

let ALL_PLAYERS = [];

function normalizeRole(player){
  const r = (player.role || player.position || player.poste || '').toString().toLowerCase();
  if (r.startsWith('att')) return 'atk';
  if (r.startsWith('mil')) return 'mil';
  if (r.startsWith('def')) return 'def';
  if (r.startsWith('gar') || r.startsWith('gk') || r.startsWith('goal')) return 'gar';
  return r; // fallback si déjà en 'atk/mil/def/gar'
}

// Charge le JSON puis construit la grille
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch("../characters/characters.json"); // adapte le chemin si besoin
    const players = await res.json();
    ALL_PLAYERS = players;
    renderCharacters(ALL_PLAYERS);
    setupFilters();
  } catch (e) {
    console.error('Impossible de charger characters.json', e);
  }
});

function renderCharacters(list) {
  const grid = document.getElementById('charGrid');
  if (!grid) return;

  // Fragment = performance (insertion en une fois)
  const frag = document.createDocumentFragment();

  list.forEach(player => {
    const li = document.createElement('li');
    li.className = 'char';
    li.dataset.role = normalizeRole(player); // gar/atk/mil/def

    // Image
    const img = document.createElement('img');
    img.src = player.image;
    img.alt = player.fullName || `${player.firstName} ${player.lastName}` || 'Player';
    // flou si spoiler
    if (player.locked) img.classList.add('is-blurred');

    // Nom
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = player.fullName || `${player.firstName} ${player.lastName}`;

    // Lien cliquable
    const link = document.createElement('a');
    const fileName = (player.fullName || `${player.firstName}_${player.lastName}`)
      .toLowerCase()
      .replace(/\s+/g, '_');
    link.href = `pages/${fileName}.html`;

    // Rendre toute la carte cliquable
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      window.location.href = link.href;
    });

    // Empêche la propagation inutile (optionnel)
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Optionnel accessibilité: aria-label
    link.setAttribute('aria-label', name.textContent);

    // Ajoute image et nom au lien
    link.appendChild(img);
    link.appendChild(name);

    // Ajoute lien au li
    li.appendChild(link);
    frag.appendChild(li);
  });

  // Remplace le contenu
  grid.replaceChildren(frag);

  // (Optionnel) compteur
  const countEl = document.getElementById('charCount');
  if (countEl) countEl.textContent = `Total ${list.length}`;
}

/* ========================================================================
   FILTRAGE DES PERSONNAGES
   ------------------------------------------------------------------------
   Ici se trouve toute la logique de filtrage.
   Pour ajouter un nouveau filtre :
     1) Ajouter des cases à cocher dans le HTML avec un attribut name="..."
     2) Ajouter un normaliseur dans NORMALIZERS (ex: element, rareté, etc.)
     3) (Optionnel) Mapper le name HTML vers une clé logique via FILTER_GROUP_ALIASES
     4) C'est tout : matchesActive utilisera automatiquement ces groupes
   ======================================================================== */

function getActiveFilters(){
  return Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked'))
    .map(b => b.value.toLowerCase());
}

function matchesActive(player, active){
  return active.includes(normalizeRole(player));
}

function applyFilters(){
  const active = getActiveFilters();

  if (active.length === 0){
    renderCharacters(ALL_PLAYERS);
    return;
  }

  const filtered = ALL_PLAYERS.filter(p => matchesActive(p, active));
  renderCharacters(filtered);
}

function setupFilters(){
  const boxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
  boxes.forEach(b => {
    b.addEventListener('change', applyFilters);
  });
}