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
  
  // Charge l'aperçu de l'équipe une fois l'affichage prêt
  chargerApercuEquipe();
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
      // Case 1 : Le nom du Pokémon uniquement (on retire le flex et le bouton)
      '<td class="col-nom" style="text-align:left; padding-left:12px;" title="' + pokemon.nomFr + '">' + pokemon.nomFr + ' ' + badgeHtml + '</td>' +
      
      // Case 2 (NOUVELLE COLOUNE) : La case contenant uniquement ton bouton vert
      '<td style="text-align:center; width: 40px;">' +
	  '<button class="btn-add-pokemon-list" title="Ajouter à l\'équipe" onclick="ajouterPokemonDepuisPokedex(' + pokemon.id + ', \'' + pokemon.slug + '\', \'' + pokemon.nomFr + '\', \'' + sprite + '\', \'' + pokemon.forme + '\', ' + JSON.stringify(types).replace(/"/g, '&quot;') + ')">+</button>' +
	  '</td>' +

      
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

  // Modifie le dictionnaire colMap pour correspondre aux nouveaux index des colonnes :
  const colMap = {
    5:  "data-hp",      // Était 4 avant
    6:  "data-atk",     // Était 5 avant
    7:  "data-def",     // Était 6 avant
    8:  "data-spa",     // Était 7 avant
    9:  "data-spd",     // Était 8 avant
    10: "data-spe",     // Était 9 avant
    11: "data-total"    // Était 10 avant
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
         // 1. On place la valeur numérique en premier
         '<span class="stat-value">' + value + '</span>' +
         // 2. La barre colorée vient ensuite
         '<div class="stat-bar-bg">' +
         '<div class="stat-bar-fill" style="width:' + pct + '%; background:' + color + ';"></div>' +
         '</div>' +
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
// 8. COUPLAGE AVEC LA MÉMOIRE DE L'ÉQUIPE (LOCALSTORAGE)
// ============================================================
const TYPE_CSS_INDEX = {
  "Normal":"Normal","Feu":"Feu","Eau":"Eau","Plante":"Plante",
  "Électrik":"Electrik","Glace":"Glace","Combat":"Combat","Poison":"Poison",
  "Sol":"Sol","Vol":"Vol","Psy":"Psy","Insecte":"Insecte","Roche":"Roche",
  "Spectre":"Spectre","Dragon":"Dragon","Ténèbres":"Tenebres","Acier":"Acier","Fée":"Fee"
};

function chargerApercuEquipe() {
  const sauvegarde = localStorage.getItem("pokemon_champions_team");
  let equipe = [null, null, null, null, null, null];

  if (sauvegarde) {
    try {
      const equipeChargee = JSON.parse(sauvegarde);
      if (Array.isArray(equipeChargee) && equipeChargee.length === 6) {
        equipe = equipeChargee;
      }
    } catch (e) {
      console.error("Erreur de lecture de l'équipe", e);
    }
  }

  const count = equipe.filter(t => t !== null).length;
  const counterEl = document.getElementById("team-counter");
  if (counterEl) counterEl.textContent = count + " / 6 Pokémon dans l'équipe";

  equipe.forEach((data, index) => {
    const slot = document.getElementById("slot-" + index);
    if (!slot) return;

    if (!data) {
      slot.className = "team-slot empty";
      slot.innerHTML = '<span class="slot-placeholder">Slot Vide</span>';
      return;
    }

    let badgeHtml = "";
    if (data.forme === "mega")     badgeHtml = '<span class="badge-mega">MÉGA</span>';
    if (data.forme === "regional") badgeHtml = '<span class="badge-regional">RÉGIONALE</span>';
    if (data.forme === "special")  badgeHtml = '<span class="badge-special">SPÉCIALE</span>';

    slot.className = "team-slot filled";
    slot.innerHTML =
      (data.sprite ? '<img class="slot-sprite" src="' + data.sprite + '" alt="' + data.nomFr + '">' : '<div class="slot-no-sprite">?</div>') +
      '<div class="slot-name" title="' + data.nomFr + '">' + data.nomFr + '</div>' +
      '<div class="slot-badge">' + badgeHtml + '</div>' +
      '<div class="slot-types">' +
        data.types.map(t => '<span class="type-badge type-' + (TYPE_CSS_INDEX[t] || t) + '">' + t + '</span>').join("") +
      '</div>';
  });
}

// ============================================================
// 9. DÉMARRAGE
// ============================================================
window.addEventListener("DOMContentLoaded", loadPokemon);


// ============================================================
// FONCTION POUR AJOUTER UN POKÉMON DEPUIS LE BOUTON VERT (SANS ALERT)
// ============================================================
function ajouterPokemonDepuisPokedex(id, slug, nomFr, sprite, forme, typesArr) {
  // 1. Charger l'équipe actuelle depuis le LocalStorage
  const sauvegarde = localStorage.getItem("pokemon_champions_team");
  let equipe = [null, null, null, null, null, null];
  
  if (sauvegarde) {
    try {
      equipe = JSON.parse(sauvegarde);
    } catch (e) {
      console.error(e);
    }
  }

  // Vérification Doublon avec message temporaire
  const estDejaDansLEquipe = equipe.some(slot => slot !== null && slot.slug === slug);
  if (estDejaDansLEquipe) {
    showMessage("⚠️ " + nomFr + " est déjà dans votre équipe !", "warning");
    return;
  }

  // Trouver le premier slot vide
  const slotLibreIndex = equipe.findIndex(slot => slot === null);

  // Vérification Équipe Pleine avec message temporaire
  if (slotLibreIndex === -1) {
    showMessage("⛔ L'équipe est déjà complète (6/6) !", "error");
    return;
  }

  // Traduire les types en Français avant la sauvegarde
  const typesEnFrancais = typesArr.map(t => translateType(t));

  // Créer l'objet du Pokémon
  const nouveauPokemon = {
    id: id,
    slug: slug,
    nomFr: nomFr,
    sprite: sprite,
    forme: forme,
    types: typesEnFrancais
  };

  // Insérer le Pokémon dans le slot vide et sauvegarder
  equipe[slotLibreIndex] = nouveauPokemon;
  localStorage.setItem("pokemon_champions_team", JSON.stringify(equipe));

  // Rafraîchir l'affichage des slots d'aperçu en haut de index.html
  chargerApercuEquipe();
  
  // Message de confirmation fluide à la place de l'alert !
  showMessage("✅ " + nomFr + " ajouté à l'équipe !", "success");
}


// ============================================================
// SYSTEME DE NOTIFICATION TEMPORAIRE (STYLE BANDEAU)
// ============================================================
function showMessage(text, type) {
  const msgEl = document.getElementById("team-message");
  if (!msgEl) return;

  msgEl.textContent = text;
  msgEl.className = "team-message " + type; // applique les styles .success, .warning, .error, etc.
  
  // On annule le précédent chronomètre s'il y en avait un en cours
  if (window.teamMessageTimeout) {
    clearTimeout(window.teamMessageTimeout);
  }

  // Le bandeau s'efface automatiquement après 3 secondes (3000 ms)
  window.teamMessageTimeout = setTimeout(function() {
    msgEl.textContent = "";
    msgEl.className = "team-message";
  }, 3000);
}