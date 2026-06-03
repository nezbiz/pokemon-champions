// ============================================================
// index.js — Logique de la page Pokédex
// Dépendance : pokemon-list.js doit être chargé avant ce fichier
// (fournit POKEMON_LIST et translateType)
// ============================================================

// ============================================================
// 1. COULEURS DES BARRES DE STATISTIQUES
// ============================================================
const STAT_COLORS = {
  hp:               "#A7DB8D",
  attack:           "#FAE078",
  defense:          "#F5AC78",
  "special-attack": "#8ddde5",
  "special-defense":"#8da4f5",
  speed:            "#c982f1",
};

// ============================================================
// 2. VARIABLES GLOBALES DE TRI
// ============================================================
let sortCol = -1;
let sortAsc = true;
let allRows = [];

// ============================================================
// 3. FONCTION PRINCIPALE : CHARGEMENT DES DONNÉES
// ============================================================
async function loadPokemon() {
  const tbody = document.getElementById("pokemon-tbody");
  const total = POKEMON_LIST.length;
  let loaded = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < POKEMON_LIST.length; i += BATCH_SIZE) {
    const batch = POKEMON_LIST.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(p => fetchPokemonData(p)));

    results.forEach(result => {
      if (result) {
        tbody.appendChild(result.row);
        allRows.push(result.row);
      }
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      document.getElementById("progress-bar").style.width = pct + "%";
      document.getElementById("progress-text").textContent =
        loaded + " / " + total + " Pokémon chargés...";
    });
  }

  document.getElementById("loading").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  populateTypeFilter();
  updateCounter();
}

// ============================================================
// 4. FONCTION DE RÉCUPÉRATION D'UN POKÉMON VIA POKEAPI
// ============================================================
async function fetchPokemonData(pokemon) {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.slug);
    if (!res.ok) throw new Error("Erreur API pour " + pokemon.slug);
    const data = await res.json();

    const sprite =
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default || "";

    const types = data.types.map(t => t.type.name);

    const statsMap = {};
    data.stats.forEach(s => { statsMap[s.stat.name] = s.base_stat; });
    const hp    = statsMap["hp"]               || 0;
    const atk   = statsMap["attack"]            || 0;
    const def   = statsMap["defense"]           || 0;
    const spa   = statsMap["special-attack"]    || 0;
    const spd   = statsMap["special-defense"]   || 0;
    const spe   = statsMap["speed"]             || 0;
    const total = hp + atk + def + spa + spd + spe;

    const tr = document.createElement("tr");
    tr.setAttribute("data-hp",    hp);
    tr.setAttribute("data-atk",   atk);
    tr.setAttribute("data-def",   def);
    tr.setAttribute("data-spa",   spa);
    tr.setAttribute("data-spd",   spd);
    tr.setAttribute("data-spe",   spe);
    tr.setAttribute("data-total", total);
    tr.setAttribute("data-name",  pokemon.nomFr.toLowerCase());
    tr.setAttribute("data-types", types.join(","));
    tr.setAttribute("data-forme", pokemon.forme);

    let badgeHtml = "";
    if (pokemon.forme === "mega")     badgeHtml = '<span class="badge-mega">MÉGA</span>';
    if (pokemon.forme === "regional") badgeHtml = '<span class="badge-regional">RÉGIONALE</span>';
    if (pokemon.forme === "special")  badgeHtml = '<span class="badge-special">SPÉCIALE</span>';

    const typesFr = types.map(t => translateType(t));

    tr.innerHTML =
      '<td>' + pokemon.id + '</td>' +
      '<td>' + (sprite ? '<img class="sprite" src="' + sprite + '" alt="' + pokemon.nomFr + '" loading="lazy"/>' : "—") + '</td>' +
      '<td class="col-nom" style="text-align:left; padding-left:12px;" title="' + pokemon.nomFr + '">' + pokemon.nomFr + ' ' + badgeHtml + '</td>' +
      '<td>' + typesFr.map(function(t){ return '<span class="type-badge type-' + t + '">' + t + '</span>'; }).join("") + '</td>' +
      '<td>' + makeStatBar(hp,  "hp",               255) + '</td>' +
      '<td>' + makeStatBar(atk, "attack",            190) + '</td>' +
      '<td>' + makeStatBar(def, "defense",           250) + '</td>' +
      '<td>' + makeStatBar(spa, "special-attack",    194) + '</td>' +
      '<td>' + makeStatBar(spd, "special-defense",   250) + '</td>' +
      '<td>' + makeStatBar(spe, "speed",             200) + '</td>' +
      '<td><strong>' + total + '</strong></td>';

    return { row: tr };

  } catch (e) {
    console.warn("Impossible de charger : " + pokemon.slug, e);
    return null;
  }
}

// ============================================================
// 5. FONCTION DE TRI DES COLONNES
// ============================================================
function sortTable(colIndex) {
  if (sortCol === colIndex) {
    sortAsc = !sortAsc;
  } else {
    sortCol = colIndex;
    sortAsc = false;
  }

  const colMap = {
    4:  "data-hp",
    5:  "data-atk",
    6:  "data-def",
    7:  "data-spa",
    8:  "data-spd",
    9:  "data-spe",
    10: "data-total"
  };

  const attr = colMap[colIndex];
  const tbody = document.getElementById("pokemon-tbody");
  const rows = Array.from(tbody.querySelectorAll("tr:not([style*='display: none'])"));

  rows.sort(function(a, b) {
    const valA = parseInt(a.getAttribute(attr)) || 0;
    const valB = parseInt(b.getAttribute(attr)) || 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  rows.forEach(function(r) { tbody.appendChild(r); });

  document.querySelectorAll("th.sortable").forEach(function(th) {
    th.classList.remove("sort-active");
    const col = parseInt(th.getAttribute("data-col"));
    const arrow = col === colIndex ? (sortAsc ? " \u2191" : " \u2193") : " \u2195";
    th.textContent = th.textContent.replace(/ [\u2195\u2191\u2193]$/, "") + arrow;
  });
  const activeHeader = document.querySelector('th[data-col="' + colIndex + '"]');
  if (activeHeader) activeHeader.classList.add("sort-active");
}

// ============================================================
// 6. FONCTION DE FILTRAGE
// ============================================================
function filterTable() {
  const search      = document.getElementById("search").value.toLowerCase().trim();
  const filterType  = document.getElementById("filter-type").value;
  const filterForme = document.getElementById("filter-forme").value;

  allRows.forEach(function(row) {
    const name  = row.getAttribute("data-name")  || "";
    const types = row.getAttribute("data-types") || "";
    const forme = row.getAttribute("data-forme") || "";

    const matchSearch = name.includes(search);
    const matchType   = !filterType  || types.includes(filterType.toLowerCase());
    const matchForme  = !filterForme || forme === filterForme;

    row.style.display = (matchSearch && matchType && matchForme) ? "" : "none";
  });

  updateCounter();
}

// ============================================================
// 7. FONCTIONS UTILITAIRES
// ============================================================
function makeStatBar(value, statName, maxVal) {
  const pct   = Math.min(100, Math.round((value / maxVal) * 100));
  const color = STAT_COLORS[statName] || "#aaa";
  return '<div class="stat-bar-container">' +
         '<div class="stat-bar-bg">' +
         '<div class="stat-bar-fill" style="width:' + pct + '%; background:' + color + ';"></div>' +
         '</div>' +
         '<span class="stat-value">' + value + '</span>' +
         '</div>';
}

function populateTypeFilter() {
  const types = new Set();
  allRows.forEach(function(row) {
    (row.getAttribute("data-types") || "").split(",").forEach(function(t) {
      if (t) types.add(t);
    });
  });

  const typesFr = Array.from(types).map(function(t) {
    return { en: t, fr: translateType(t) };
  }).sort(function(a, b) { return a.fr.localeCompare(b.fr); });

  const select = document.getElementById("filter-type");
  typesFr.forEach(function(item) {
    const opt = document.createElement("option");
    opt.value = item.en;
    opt.textContent = item.fr;
    select.appendChild(opt);
  });
}

function updateCounter() {
  const visible = allRows.filter(function(r) { return r.style.display !== "none"; }).length;
  document.getElementById("counter").textContent =
    visible + " Pokémon affichés sur " + allRows.length;
}

// ============================================================
// 8. DÉMARRAGE
// ============================================================
window.addEventListener("DOMContentLoaded", loadPokemon);
