// Charge le JSON puis construit la grille
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch("../characters/characters.json"); // adapte le chemin si besoin
    const players = await res.json();
    renderCharacters(players);
  } catch (e) {
    console.error('Impossible de charger characters.json', e);
  }
});

function renderCharacters(list) {
  const grid = document.getElementById('charGrid');
  if (!grid) return;

  // Fragment = perf (insertion en une fois)
  const frag = document.createDocumentFragment();

  list.forEach(player => {
    const li = document.createElement('li');
    li.className = 'char';
    li.dataset.role = player.role; // gar/atk/mil/def → ton CSS colore automatiquement

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
    link.href = `${fileName}.html`;

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