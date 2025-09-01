console.log("characters.js loaded");

const filterbtn = document.querySelectorAll('.filter-options label');

let ALL_PLAYERS = [];

function normalizeRole(player){
  const r = (player.role || player.position || player.poste || '').toString().trim().toLowerCase();
  if (r.startsWith('att')) return 'atk';
  if (r.startsWith('atk')) return 'atk';
  if (r.startsWith('sup')) return 'sup';
  if (r.startsWith('coach')) return 'coach';
  if (r.startsWith('mil')) return 'mil';
  if (r.startsWith('def')) return 'def';
  if (r.startsWith('gar') || r.startsWith('gk') || r.startsWith('goal')) return 'gar';
  return r; // fallback si déjà en 'atk/mil/def/gar'
}

function normalizeGame(player){
  // `player.game` peut être une chaîne ("IE1") ou un tableau (["IE1","IE2"]) selon ton JSON
  const raw = player.game;
  if (!raw) return '';

  // Convertit en tableau de chaînes en minuscules
  const list = Array.isArray(raw) ? raw : [raw];
  const games = list
    .map(g => g?.toString().trim().toLowerCase())
    .filter(Boolean);

  // Mappe quelques variations vers des clés stables
  const mapOne = (g) => {
    if (g.startsWith('ie1') || g.includes('inazuma eleven 1')) return 'ie1';
    if (g.startsWith('ie2') || g.includes('firestorm') || g.includes('blizzard')) return 'ie2';
    if (g.startsWith('ie3')) return 'ie3';
    if (g.startsWith('go1') || g.includes('chronostone')) return 'go1';
    if (g.startsWith('go2')) return 'go2';
    if (g.startsWith('go3')) return 'go3';
    if (g.startsWith('vr')  || g.includes('victory road')) return 'vr';
    return g; // par défaut, renvoie la valeur en minuscule
  };

  // Retourne la première clé (si plusieurs jeux, tu peux adapter à ton besoin)
  return mapOne(games[0] || '');
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
    img.className = 'char-img';
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
    .map(b => (b.value || ''));
}

function normalizeGames(player){
  const raw = player.game;
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : [raw];
  const games = list
    .map(g => g?.toString().trim().toUpperCase())
    .filter(Boolean)
    .map(g => {
      // Canonical tokens to match HTML values: IE1, IE2, IE3, IEGO1..3, IEA, IEO, IEVR
      if (/^IE\d+$/.test(g)) return g;                 // IE1, IE2, IE3...
      if (/^IEGO\d+$/.test(g)) return g;               // IEGO1..IEGO3
      if (/^IE[AO]$/.test(g)) return g;                 // IEA, IEO
      if (g === 'IEVR' || g === 'VR' || g.includes('VICTORY ROAD')) return 'IEVR';
      // Map GOx synonyms to IEGOx
      const go = g.match(/^GO(\d+)$/);
      if (go) return `IEGO${go[1]}`;
      return g;
    });

  return [...new Set(games)];
}

function matchesActive(player, active){
  const ROLE_TOKENS = new Set(['atk','mil','def','gar','sup','coach']);
  const selectedRoles = new Set(
    active.map(v => v.toLowerCase()).filter(v => ROLE_TOKENS.has(v))
  );

  const selectedGames = new Set(
    active.map(v => v.toUpperCase()).filter(v => /^(IE\d+|IEGO\d+|IE[AO]|IEVR)$/.test(v))
  );

  const roleOK = selectedRoles.size ? selectedRoles.has(normalizeRole(player)) : true;

  const playerGames = normalizeGames(player);
  const gameOK = selectedGames.size ? playerGames.some(g => selectedGames.has(g)) : true;

  return roleOK && gameOK;
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