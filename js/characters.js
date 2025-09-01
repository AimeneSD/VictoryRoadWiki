/** =====================================================================
 * VICTORY ROAD – CHARACTERS
 * ---------------------------------------------------------------------
 * Organisation « à la manière du CSS » avec sections claires :
 *  1) CONSTANTES & ÉTAT GLOBAL
 *  2) OUTILS DE NORMALISATION (roles, games)
 *  3) RENDU DE LA GRILLE (DOM)
 *  4) LOGIQUE DE FILTRAGE
 *  5) INITIALISATION (DOMContentLoaded)
 * ===================================================================== */

console.log("characters.js loaded");

/* =============================
 * 1) CONSTANTES & ÉTAT GLOBAL
 * ============================= */
let ALL_PLAYERS = [];

// Jeux et rôles reconnus (pour la validation des filtres)
const ROLE_TOKENS = new Set(["atk", "mil", "def", "gar", "sup", "coach"]);
const GAME_TOKEN_REGEX = /^(IE\d+|IEGO\d+|IE[AO]|IEVR)$/; // IE1, IE2, IE3, IEGO1..3, IEA, IEO, IEVR
// Éléments canoniques (EN). On acceptera les synonymes FR/EN via normalisation.
const ELEMENT_TOKENS = new Set(["mountain", "fire", "forest", "wind", "water", "earth"]);

/* ==========================================
 * 2) OUTILS DE NORMALISATION (roles, games, elements)
 * ========================================== */

/*--------- NORMALISATION ROLE ------------*/


function normalizeRole(player) {
  const r = (player.role || player.position || player.poste || "").toString().trim().toLowerCase();
  if (r.startsWith("att") || r.startsWith("atk")) return "atk";
  if (r.startsWith("sup")) return "sup";
  if (r.startsWith("coach")) return "coach";
  if (r.startsWith("mil")) return "mil";
  if (r.startsWith("def")) return "def";
  if (r.startsWith("gar") || r.startsWith("gk") || r.startsWith("goal")) return "gar";
  return r; // fallback si déjà en 'atk/mil/def/gar' ou autre
}


/*--------- NORMALISATION GAME ------------*/


function normalizeGames(player) {
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
      if (g === "IEVR" || g === "VR" || g.includes("VICTORY ROAD")) return "IEVR";
      // Map GOx synonyms to IEGOx
      const go = g.match(/^GO(\d+)$/);
      if (go) return `IEGO${go[1]}`;
      return g;
    });

  return [...new Set(games)];
}


/*--------- NORMALISATION ELEMENT ------------*/

function normalizeElementValue(v) {
  const s = (v || "").toString().trim().toLowerCase();
  // Français → canonique EN
  if (["montagne", "mountain"].includes(s)) return "mountain";
  if (["feu", "fire"].includes(s)) return "fire";
  if (["bois", "forêt", "foret", "forest"].includes(s)) return "forest";
  if (["vent", "wind"].includes(s)) return "wind";
  return s;
}

function normalizeElement(player) {
  return normalizeElementValue(player && player.element);
}

/* ==============================
 * 3) RENDU DE LA GRILLE (DOM)
 * ============================== */
function renderCharacters(list) {
  const grid = document.getElementById('charGrid');
  if (!grid) return;

  const frag = document.createDocumentFragment(); // insertion en une fois

  list.forEach(player => {
    const li = document.createElement('li');
    li.className = 'char';
    li.dataset.role = normalizeRole(player); // gar/atk/mil/def/sup/coach

    // Badge élément (si défini dans ton JSON) – utilisé aussi pour le filtrage
    if (player.element) {
      const badge = document.createElement('div');
      badge.className = 'element-badge';

      const elemImg = document.createElement('img');
      elemImg.src = `logo/${player.element.toLowerCase()}.png`;
      elemImg.alt = player.element;

      badge.appendChild(elemImg);
      li.appendChild(badge);

      li.dataset.element = normalizeElement(player);
    }

    // Image
    const img = document.createElement('img');
    img.className = 'char-img';
    img.src = player.image;
    img.alt = player.fullName || `${player.firstName} ${player.lastName}` || 'Player';
    if (player.locked) img.classList.add('is-blurred'); // flou si spoiler

    // Nom
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = player.fullName || `${player.firstName} ${player.lastName}`;

    // Lien cliquable (rend toute la carte cliquable)
    const link = document.createElement('a');
    const fileName = (player.fullName || `${player.firstName}_${player.lastName}`)
      .toLowerCase()
      .replace(/\s+/g, '_');
    link.href = `pages/${fileName}.html`;
    link.setAttribute('aria-label', name.textContent); // accessibilité

    li.style.cursor = 'pointer';
    li.addEventListener('click', () => { window.location.href = link.href; });
    link.addEventListener('click', (e) => { e.stopPropagation(); });

    // Compose la carte
    link.appendChild(img);
    link.appendChild(name);
    li.appendChild(link);
    frag.appendChild(li);
  });

  grid.replaceChildren(frag);

  const countEl = document.getElementById('charCount');
  if (countEl) countEl.textContent = `Total ${list.length}`;
}

/* =============================
 * 4) LOGIQUE DE FILTRAGE
 * ============================= */
function getActiveFilters() {
  return Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked'))
    .map(b => (b.value || ''));
}

function matchesActive(player, active) {
  // Rôles sélectionnés
  const selectedRoles = new Set(
    active.map(v => v.toLowerCase()).filter(v => ROLE_TOKENS.has(v))
  );

  // Jeux sélectionnés
  const selectedGames = new Set(
    active.map(v => v.toUpperCase()).filter(v => GAME_TOKEN_REGEX.test(v))
  );

  // Éléments sélectionnés
  const selectedElements = new Set(
    active.map(v => normalizeElementValue(v)).filter(v => ELEMENT_TOKENS.has(v))
  );

  // Vérifs de correspondance (ET strict entre groupes, OU à l’intérieur d’un groupe)
  const roleOK = selectedRoles.size ? selectedRoles.has(normalizeRole(player)) : true;

  const playerGames = normalizeGames(player);
  const gameOK = selectedGames.size ? playerGames.some(g => selectedGames.has(g)) : true;

  // BUG FIX: on testait par erreur les éléments contre selectedGames.
  const playerElement = normalizeElement(player);
  const elementOK = selectedElements.size ? selectedElements.has(playerElement) : true;

  return roleOK && gameOK && elementOK;
}

function applyFilters() {
  const active = getActiveFilters();
  if (active.length === 0) {
    renderCharacters(ALL_PLAYERS);
    return;
  }
  const filtered = ALL_PLAYERS.filter(p => matchesActive(p, active));
  renderCharacters(filtered);
}

function setupFilters() {
  const boxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
  boxes.forEach(b => {
    b.addEventListener('change', applyFilters);
  });
}

/* =============================
 * 5) INITIALISATION
 * ============================= */
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