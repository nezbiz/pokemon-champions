// ============================================================
// team.js — Logique de la page Équipe
// Dépendance : pokemon-list.js doit être chargé avant ce fichier
// (fournit POKEMON_LIST et translateType)
// ============================================================

// ============================================================
// 1. ÉTAT DE L'ÉQUIPE Et Cache local pour les stats d'API
// ============================================================
const team = [null, null, null, null, null, null];
const POKEMON_DATA_CACHE = {}; // Cache pour stocker les types, stats et talents de l'API

// ============================================================
// 2. TABLE DES TYPES (défense)
// ============================================================
const TYPE_CHART = {
  Normal:   { Normal:1, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:1, Poison:1, Sol:1, Vol:1, Psy:1, Insecte:1, Roche:0.5, Spectre:0, Dragon:1, Ténèbres:1, Acier:0.5, Fée:1 },
  Feu:      { Normal:1, Feu:0.5, Eau:0.5, Plante:2, Électrik:1, Glace:2, Combat:1, Poison:1, Sol:1, Vol:1, Psy:1, Insecte:2, Roche:0.5, Spectre:1, Dragon:0.5, Ténèbres:1, Acier:2, Fée:1 },
  Eau:      { Normal:1, Feu:2, Eau:0.5, Plante:0.5, Électrik:1, Glace:1, Combat:1, Poison:1, Sol:2, Vol:1, Psy:1, Insecte:1, Roche:2, Spectre:1, Dragon:0.5, Ténèbres:1, Acier:1, Fée:1 },
  Plante:   { Normal:1, Feu:0.5, Eau:2, Plante:0.5, Électrik:1, Glace:1, Combat:1, Poison:0.5, Sol:2, Vol:0.5, Psy:1, Insecte:0.5, Roche:2, Spectre:1, Dragon:0.5, Ténèbres:1, Acier:0.5, Fée:1 },
  Électrik: { Normal:1, Feu:1, Eau:2, Plante:0.5, Électrik:0.5, Glace:1, Combat:1, Poison:1, Sol:0, Vol:2, Psy:1, Insecte:1, Roche:1, Spectre:1, Dragon:0.5, Ténèbres:1, Acier:1, Fée:1 },
  Glace:    { Normal:1, Feu:0.5, Eau:0.5, Plante:2, Électrik:1, Glace:0.5, Combat:1, Poison:1, Sol:2, Vol:2, Psy:1, Insecte:1, Roche:1, Spectre:1, Dragon:2, Ténèbres:1, Acier:0.5, Fée:1 },
  Combat:   { Normal:2, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:2, Combat:1, Poison:0.5, Sol:1, Vol:0.5, Psy:0.5, Insecte:0.5, Roche:2, Spectre:0, Dragon:1, Ténèbres:2, Acier:2, Fée:0.5 },
  Poison:   { Normal:1, Feu:1, Eau:1, Plante:2, Électrik:1, Glace:1, Combat:1, Poison:0.5, Sol:0.5, Vol:1, Psy:1, Insecte:1, Roche:0.5, Spectre:0.5, Dragon:1, Ténèbres:1, Acier:0, Fée:2 },
  Sol:      { Normal:1, Feu:2, Eau:1, Plante:0.5, Électrik:2, Glace:1, Combat:1, Poison:2, Sol:1, Vol:0, Psy:1, Insecte:0.5, Roche:2, Spectre:1, Dragon:1, Ténèbres:1, Acier:2, Fée:1 },
  Vol:      { Normal:1, Feu:1, Eau:1, Plante:2, Électrik:0.5, Glace:1, Combat:2, Poison:1, Sol:1, Vol:1, Psy:1, Insecte:2, Roche:0.5, Spectre:1, Dragon:1, Ténèbres:1, Acier:0.5, Fée:1 },
  Psy:      { Normal:1, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:2, Poison:2, Sol:1, Vol:1, Psy:0.5, Insecte:1, Roche:1, Spectre:1, Dragon:1, Ténèbres:0, Acier:0.5, Fée:1 },
  Insecte:  { Normal:1, Feu:0.5, Eau:1, Plante:2, Électrik:1, Glace:1, Combat:0.5, Poison:0.5, Sol:1, Vol:0.5, Psy:2, Insecte:1, Roche:1, Spectre:0.5, Dragon:1, Ténèbres:2, Acier:0.5, Fée:0.5 },
  Roche:    { Normal:1, Feu:2, Eau:1, Plante:1, Électrik:1, Glace:2, Combat:0.5, Poison:1, Sol:0.5, Vol:2, Psy:1, Insecte:2, Roche:1, Spectre:1, Dragon:1, Ténèbres:1, Acier:0.5, Fée:1 },
  Spectre:  { Normal:0, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:1, Poison:1, Sol:1, Vol:1, Psy:2, Insecte:1, Roche:1, Spectre:2, Dragon:1, Ténèbres:0.5, Acier:1, Fée:1 },
  Dragon:   { Normal:1, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:1, Poison:1, Sol:1, Vol:1, Psy:1, Insecte:1, Roche:1, Spectre:1, Dragon:2, Ténèbres:1, Acier:0.5, Fée:0 },
  Ténèbres: { Normal:1, Feu:1, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:0.5, Poison:1, Sol:1, Vol:1, Psy:2, Insecte:1, Roche:1, Spectre:2, Dragon:1, Ténèbres:0.5, Acier:1, Fée:0.5 },
  Acier:    { Normal:1, Feu:0.5, Eau:0.5, Plante:1, Électrik:0.5, Glace:2, Combat:1, Poison:1, Sol:1, Vol:1, Psy:1, Insecte:1, Roche:2, Spectre:1, Dragon:1, Ténèbres:1, Acier:0.5, Fée:2 },
  Fée:      { Normal:1, Feu:0.5, Eau:1, Plante:1, Électrik:1, Glace:1, Combat:2, Poison:0.5, Sol:1, Vol:1, Psy:1, Insecte:1, Roche:1, Spectre:1, Dragon:2, Ténèbres:2, Acier:0.5, Fée:1 },
};

const ALL_TYPES = ["Normal","Feu","Eau","Plante","Électrik","Glace","Combat","Poison","Sol","Vol","Psy","Insecte","Roche","Spectre","Dragon","Ténèbres","Acier","Fée"];

// ============================================================
// 3. CORRESPONDANCE TYPE → CLASSE CSS
// ============================================================
const TYPE_CSS = {
  "Normal":"Normal","Feu":"Feu","Eau":"Eau","Plante":"Plante",
  "Électrik":"Electrik","Glace":"Glace","Combat":"Combat","Poison":"Poison",
  "Sol":"Sol","Vol":"Vol","Psy":"Psy","Insecte":"Insecte","Roche":"Roche",
  "Spectre":"Spectre","Dragon":"Dragon","Ténèbres":"Tenebres","Acier":"Acier","Fée":"Fee"
};

// ============================================================
// 4. COULEURS DE FOND PAR TYPE (tableau défensif)
// ============================================================
const TYPE_BG = {
  "Normal":    { bg: "#A8A878", color: "#333" },
  "Feu":       { bg: "#F08030", color: "#fff" },
  "Eau":       { bg: "#6890F0", color: "#fff" },
  "Plante":    { bg: "#78C850", color: "#fff" },
  "Électrik":  { bg: "#F8D030", color: "#333" },
  "Glace":     { bg: "#98D8D8", color: "#333" },
  "Combat":    { bg: "#C03028", color: "#fff" },
  "Poison":    { bg: "#A040A0", color: "#fff" },
  "Sol":       { bg: "#E0C068", color: "#333" },
  "Vol":       { bg: "#A890F0", color: "#fff" },
  "Psy":       { bg: "#F85888", color: "#fff" },
  "Insecte":   { bg: "#A8B820", color: "#fff" },
  "Roche":     { bg: "#B8A038", color: "#333" },
  "Spectre":   { bg: "#705898", color: "#fff" },
  "Dragon":    { bg: "#7038F8", color: "#fff" },
  "Ténèbres":  { bg: "#705848", color: "#fff" },
  "Acier":     { bg: "#B8B8D0", color: "#333" },
  "Fée":       { bg: "#EE99AC", color: "#333" },
};

// ============================================================
// 5. UTILITAIRES
// ============================================================
function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getBadgeHtml(forme) {
  if (forme === "mega")     return '<span class="badge-mega">MÉGA</span>';
  if (forme === "regional") return '<span class="badge-regional">RÉGIONALE</span>';
  if (forme === "special")  return '<span class="badge-special">SPÉCIALE</span>';
  return "";
}

function getMultiplier(attackingType, defenderTypes) {
  let mult = 1;
  defenderTypes.forEach(function(defType) {
    const row = TYPE_CHART[attackingType];
    if (row && row[defType] !== undefined) mult *= row[defType];
  });
  return mult;
}

// Supprime l'affichage d'un message temporaire
function showMessage(text, type) {
  const el = document.getElementById("team-message");
  if (!el) return;
  el.textContent = text;
  el.className = "team-message " + type;
  clearTimeout(el._timeout);
  el._timeout = setTimeout(function() { el.textContent = ""; el.className = "team-message"; }, 3000);
}

// Fonction utilitaire pour charger les types, stats et talents d'un Pokémon (avec mise en cache)
async function fetchPokemonDetails(slug) {
  if (POKEMON_DATA_CACHE[slug]) return POKEMON_DATA_CACHE[slug];
  
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + slug);
  if (!res.ok) throw new Error("Erreur API");
  const data = await res.json();
  
  const stats = {};
  data.stats.forEach(s => {
    if (s.stat.name === 'hp') stats.hp = s.base_stat;
    if (s.stat.name === 'attack') stats.atk = s.base_stat;
    if (s.stat.name === 'defense') stats.def = s.base_stat;
    if (s.stat.name === 'special-attack') stats.spatk = s.base_stat;
    if (s.stat.name === 'special-defense') stats.spdef = s.base_stat;
    if (s.stat.name === 'speed') stats.vit = s.base_stat;
  });

  const typesEn = data.types.map(t => t.type.name);
  const typesFr = typesEn.map(translateType);

  // Récupération des chaînes de caractères brutes des talents fournis par PokéAPI
  const talents = data.abilities.map(a => a.ability.name);

  const sprite = data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || "";

  POKEMON_DATA_CACHE[slug] = { stats: stats, types: typesFr, sprite: sprite, talents: talents };
  return POKEMON_DATA_CACHE[slug];
}

// ============================================================
// 6. RECHERCHE & SUGGESTIONS
// ============================================================
function initSearch() {
  const searchInput = document.getElementById("team-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function() {
    const query = normalize(this.value.trim());
    const container = document.getElementById("team-suggestions");
    if (!container) return;
    container.innerHTML = "";
    if (query.length < 2) return;

    const results = POKEMON_LIST.filter(function(p) {
      return normalize(p.nomFr).includes(query);
    }).slice(0, 12);

    if (results.length === 0) {
      container.innerHTML = '<div class="suggestion-empty">Aucun résultat</div>';
      return;
    }

    results.forEach(function(p) {
      const spriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + p.id + ".png";
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML =
        '<img src="' + spriteUrl + '" alt="' + p.nomFr + '" onerror="this.style.visibility=\'hidden\'">' +
        '<span class="suggestion-name">' + p.nomFr + '</span>' +
        getBadgeHtml(p.forme);
      div.addEventListener("click", function() { addToTeam(p); });
      container.appendChild(div);
    });
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest("#team-search-zone")) {
      const sug = document.getElementById("team-suggestions");
      if (sug) sug.innerHTML = "";
    }
  });
}

// ============================================================
// 7. GESTION DE L'ÉQUIPE
// ============================================================
async function addToTeam(pokemon) {
  const sug = document.getElementById("team-suggestions");
  if (sug) sug.innerHTML = "";
  const sInput = document.getElementById("team-search");
  if (sInput) sInput.value = "";

  if (team.some(function(t) { return t && t.slug === pokemon.slug; })) {
    showMessage("⚠️ " + pokemon.nomFr + " est déjà dans l'équipe !", "warning");
    return;
  }
  const slotIndex = team.findIndex(function(t) { return t === null; });
  if (slotIndex === -1) {
    showMessage("⛔ L'équipe est déjà complète (6/6) !", "error");
    return;
  }

  showMessage("⏳ Chargement de " + pokemon.nomFr + "...", "info");
  try {
    const details = await fetchPokemonDetails(pokemon.slug);
    team[slotIndex] = { slug: pokemon.slug, nomFr: pokemon.nomFr, forme: pokemon.forme, sprite: details.sprite, types: details.types };
    renderSlot(slotIndex);
    
    // Mise à jour du compteur
    const count = team.filter(function(t) { return t !== null; }).length;
    const counterEl = document.getElementById("team-counter");
    if (counterEl) counterEl.textContent = count + " / 6 Pokémon dans l'équipe";
    
    updateDefenseTable();
    showMessage("✅ " + pokemon.nomFr + " ajouté !", "success");
  } catch(e) {
    showMessage("❌ Impossible de charger " + pokemon.nomFr, "error");
  }
}

function removeFromTeam(slotIndex) {
  const name = team[slotIndex] ? team[slotIndex].nomFr : "";
  team[slotIndex] = null;
  renderSlot(slotIndex);
  
  // Mise à jour du compteur
  const count = team.filter(function(t) { return t !== null; }).length;
  const counterEl = document.getElementById("team-counter");
  if (counterEl) counterEl.textContent = count + " / 6 Pokémon dans l'équipe";
  
  updateDefenseTable();
  showMessage("🗑️ " + name + " retiré de l'équipe.", "info");
}

function renderSlot(index) {
  const slot = document.getElementById("slot-" + index);
  if (!slot) return;
  const data = team[index];
  if (!data) {
    slot.className = "team-slot empty";
    slot.innerHTML = '<span class="slot-placeholder">Ajouter<br>un Pokémon</span>';
    return;
  }
  slot.className = "team-slot filled";
  
  slot.innerHTML =
    '<button class="slot-remove" onclick="removeFromTeam(' + index + ')">✕</button>' +
    (data.sprite ? '<img class="slot-sprite" src="' + data.sprite + '" alt="' + data.nomFr + '">' : '<div class="slot-no-sprite">?</div>') +
    '<div class="slot-name" title="' + data.nomFr + '">' + data.nomFr + '</div>' +
    '<div class="slot-badge">' + getBadgeHtml(data.forme) + '</div>' +
    '<div class="slot-types">' +
      data.types.map(function(t) {
        return '<span class="type-badge type-' + (TYPE_CSS[t] || t) + '">' + t + '</span>';
      }).join("") +
    '</div>';
}

// ============================================================
// 8. TABLEAU DÉFENSIF
// ============================================================
function updateDefenseTable() {
  const tbody = document.getElementById("defense-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const activePokemon = team.filter(function(t) { return t !== null; });
  const teamSize = activePokemon.length;

  ALL_TYPES.forEach(function(atkType, rowIndex) {
    const counts = { "0": 0, "0.25": 0, "0.5": 0, "1": 0, "2": 0, "4": 0 };
    activePokemon.forEach(function(poke) {
      const mult = getMultiplier(atkType, poke.types);
      if (mult === 0)         counts["0"]++;
      else if (mult <= 0.25) counts["0.25"]++;
      else if (mult <= 0.5)  counts["0.5"]++;
      else if (mult === 1)   counts["1"]++;
      else if (mult <= 2)    counts["2"]++;
      else                   counts["4"]++;
    });

    const isDanger = teamSize > 0 &&
      (counts["2"] + counts["4"]) === teamSize &&
      counts["0"] === 0 && counts["0.25"] === 0 && counts["0.5"] === 0;

    const typeInfo = TYPE_BG[atkType] || { bg: "#555", color: "#fff" };
    const tr = document.createElement("tr");
    tr.className = (rowIndex % 2 === 0) ? "def-row-even" : "def-row-odd";

    const tdType = document.createElement("td");
    tdType.className = "td-type-full";
    tdType.style.backgroundColor = typeInfo.bg;
    tdType.style.color = typeInfo.color;
    tdType.style.fontWeight = "bold";
    tdType.style.fontSize = "13px";
    tdType.style.textAlign = "center";
    tdType.textContent = atkType;
    tr.appendChild(tdType);

    [{ key: "0" }, { key: "0.25" }, { key: "0.5" }, { key: "1" }, { key: "2" }, { key: "4" }]
      .forEach(function(def) {
        const td = document.createElement("td");
        const isTargetCell = isDanger && (def.key === "2" || def.key === "4") && counts[def.key] > 0;
        td.className = "def-stat-cell" + (isTargetCell ? " cell-danger" : "");
        td.style.color = counts[def.key] > 0 ? "#222" : "#bbb";
        td.style.fontWeight = counts[def.key] > 0 ? "bold" : "normal";
        td.textContent = counts[def.key];
        tr.appendChild(td);
      });

    tbody.appendChild(tr);
  });
}

// ============================================================
// 9. FILTRES AVANCÉS DYNAMIQUES ET EXÉCUTION DE RECHERCHE
// ============================================================

function gererDesactivationTypes() {
  const selectType1 = document.getElementById('filter-type1');
  const selectType2 = document.getElementById('filter-type2');
  if (!selectType1 || !selectType2) return;

  const val1 = selectType1.value;
  const val2 = selectType2.value;

  Array.from(selectType2.options).forEach(opt => {
    if (opt.value !== "" && opt.value === val1) {
      opt.disabled = true;
      opt.style.color = "#AAAAAA"; 
    } else {
      opt.disabled = false;
      opt.style.color = "";        
    }
  });

  Array.from(selectType1.options).forEach(opt => {
    if (opt.value !== "" && opt.value === val2) {
      opt.disabled = true;
      opt.style.color = "#AAAAAA"; 
    } else {
      opt.disabled = false;
      opt.style.color = "";        
    }
  });
}

// Génération des filtres et extraction initiale de TOUS les talents uniques de Pokémon Champions
async function genererFiltresAvances() {
  const grilleTypes = document.getElementById('advanced-type-filters');
  const selectType1 = document.getElementById('filter-type1');
  const selectType2 = document.getElementById('filter-type2');
  const selectTalent = document.getElementById('filter-talent');
  
  if (!grilleTypes) return;

  grilleTypes.innerHTML = "";

  ALL_TYPES.forEach(function(typeFr) {
    const classCss = TYPE_CSS[typeFr] || typeFr;
    const item = document.createElement('div');
    item.className = 'type-filter-item';
    item.innerHTML = `
      <span class="type-badge type-${classCss}">${typeFr}</span>
      <select id="rel-${classCss.toLowerCase()}" class="filter-relation" data-type="${typeFr}">
        <option value="">Indifférent</option>
        <option value="immunise">Immunisé (x0)</option>
        <option value="resiste">Résiste (x0.25 ou x0.5)</option>
        <option value="neutre">N'est pas faible (<= x1)</option>
        <option value="faible">Faible (x2 ou x4)</option>
      </select>
    `;
    grilleTypes.appendChild(item);

    if (selectType1) {
      const opt1 = document.createElement('option');
      opt1.value = typeFr;
      opt1.textContent = typeFr;
      selectType1.appendChild(opt1);
    }

    if (selectType2) {
      const opt2 = document.createElement('option');
      opt2.value = typeFr;
      opt2.textContent = typeFr;
      selectType2.appendChild(opt2);
    }
  });

  // --- EXTRACTION, TRI ET REMPLISSAGE DE TOUS LES TALENTS DISPONIBLES DES LE DEBUT ---
  if (selectTalent) {
    selectTalent.innerHTML = '<option value="">⏳ Chargement des talents...</option>';
    
    try {
      const BATCH_SIZE = 25;
      const talentsUniques = new Set();

      for (let i = 0; i < POKEMON_LIST.length; i += BATCH_SIZE) {
        const batch = POKEMON_LIST.slice(i, i + BATCH_SIZE);
        const detailsList = await Promise.all(
          batch.map(p => fetchPokemonDetails(p.slug).catch(() => null))
        );
        
        detailsList.forEach(details => {
          if (details && details.talents) {
            details.talents.forEach(t => talentsUniques.add(t));
          }
        });
      }

      // CRUCIAL : Extraction et tri alphabétique basé sur le résultat de la TRADUCTION française
      const listeTalentsTriees = Array.from(talentsUniques).sort((a, b) => {
        const nomFrA = translateAbility(a);
        const nomFrB = translateAbility(b);
        // Utilisation de localeCompare pour la bonne gestion française des accents (É, Œ, etc.)
        return nomFrA.localeCompare(nomFrB, 'fr', { sensitivity: 'base' });
      });

      // Remplissage final du select ordonné
      selectTalent.innerHTML = '<option value="">Tous</option>';
      listeTalentsTriees.forEach(talent => {
        const opt = document.createElement('option');
        opt.value = talent; // Le slug anglais original est envoyé à PokéAPI
        opt.textContent = translateAbility(talent); // Le nom français trié s'affiche à l'écran
        selectTalent.appendChild(opt);
      });

      selectTalent.removeAttribute('disabled');

    } catch (err) {
      console.error("Impossible de pré-charger l'intégralité des talents", err);
      selectTalent.innerHTML = '<option value="">Tous (Erreur de chargement)</option>';
    }
  }
}

// COEUR DE LA FONCTIONNALITÉ : Recherche complexe après clic ou détection de changements
async function executerRechercheAvancee() {
  const resultsContainer = document.getElementById('advanced-results-container');
  const resultsGrid = document.getElementById('advanced-results-grid');
  if (!resultsGrid || !resultsContainer) return;

  resultsGrid.innerHTML = `<p style="color: white; font-weight: bold;">⏳ Analyse et filtrage de la base de données PokéAPI en cours...</p>`;
  resultsContainer.classList.remove('hidden');

  // 1. Récupération des filtres de type d'identité
  const t1 = document.getElementById('filter-type1').value;
  const t2 = document.getElementById('filter-type2').value;

  // --- FILTRE TALENT AVANCÉ ---
  const filterTalent = document.getElementById('filter-talent') ? document.getElementById('filter-talent').value : "";

  // 2. Récupération des filtres de statistiques de base
  const statsList = ['hp', 'atk', 'def', 'spatk', 'spdef', 'vit'];
  const statFilters = {};
  statsList.forEach(s => {
    const val = parseInt(document.getElementById(`filter-val-${s}`).value, 10);
    if (!isNaN(val)) {
      statFilters[s] = {
        op: document.getElementById(`filter-op-${s}`).value,
        val: val
      };
    }
  });

  // 3. Récupération des relations de table des types voulues
  const relationFilters = [];
  document.querySelectorAll('.filter-relation').forEach(select => {
    if (select.value !== "") {
      relationFilters.push({
        attackingType: select.getAttribute('data-type'),
        wanted: select.value
      });
    }
  });

  const matchedPokemon = [];

  // 4. Parcourt de tous les Pokémon de pokemon-list.js
  for (const pokemon of POKEMON_LIST) {
    try {
      const details = await fetchPokemonDetails(pokemon.slug);

      // --- FILTRE COMPATIBILITÉ TALENT ---
      if (filterTalent && (!details.talents || !details.talents.includes(filterTalent))) continue;

      // --- FILTRE TYPE 1 & TYPE 2 ---
      if (t1 && !details.types.includes(t1)) continue;
      if (t2 && !details.types.includes(t2)) continue;
      if (t1 && t2 && details.types.length < 2) continue;

      // --- FILTRE STATISTIQUES DE BASE ---
      let statMatch = true;
      for (const [statKey, filter] of Object.entries(statFilters)) {
        const realVal = details.stats[statKey] || 0;
        if (filter.op === '>' && !(realVal > filter.val)) statMatch = false;
        if (filter.op === '<' && !(realVal < filter.val)) statMatch = false;
        if (filter.op === '=' && !(realVal === filter.val)) statMatch = false;
      }
      if (!statMatch) continue;

      // --- FILTRE RÉSISTANCES ET FAIBLESSES ---
      let relationMatch = true;
      for (const f of relationFilters) {
        const mult = getMultiplier(f.attackingType, details.types);
        if (f.wanted === 'immunise' && mult !== 0) relationMatch = false;
        if (f.wanted === 'resiste' && (mult === 0 || mult >= 1)) relationMatch = false;
        if (f.wanted === 'neutre' && mult > 1) relationMatch = false;
        if (f.wanted === 'faible' && mult <= 1) relationMatch = false;
      }
      if (!relationMatch) continue;

      matchedPokemon.push({ ...pokemon, details: details });

    } catch (err) {
      continue;
    }
  }

  // 5. Affichage final des résultats triés
  resultsGrid.innerHTML = "";
  if (matchedPokemon.length === 0) {
    resultsGrid.innerHTML = `<p style="color: white; font-weight: bold;">❌ Aucun Pokémon ne correspond à l'intégralité de ces critères.</p>`;
    return;
  }

  matchedPokemon.forEach(p => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.style = "background-color: #333; border: 1px solid #444; color: white; padding: 12px; border-radius: 8px; width: 160px; min-height: 230px; text-align: center; position: relative; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between; align-items: center;";
    
    const typesHtml = p.details.types.map(t => {
      return `<span class="type-badge type-${TYPE_CSS[t] || t}" style="font-size: 10px; padding: 2px 5px; margin: 2px; display: inline-block;">${t}</span>`;
    }).join("");

    card.innerHTML = `
      <img src="${p.details.sprite}" alt="${p.nomFr}" style="width: 90px; height: 90px; object-fit: contain; margin-bottom: 5px;" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png'">
      <div style="font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;" title="${p.nomFr}">${p.nomFr}</div>
      <div style="margin-bottom: 8px;">${getBadgeHtml(p.forme)}</div>
      <div style="margin-bottom: 10px;">${typesHtml}</div>
      <button class="add-from-advanced" style="background-color: #4CAF50; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold; cursor: pointer; width: 100%; font-size: 12px;">
        + Ajouter
      </button>
    `;

    card.querySelector('.add-from-advanced').addEventListener('click', async () => {
      await addToTeam(p);
      
      const zoneSlots = document.getElementById('team-slots');
      if (zoneSlots) {
        zoneSlots.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        zoneSlots.style.transition = "transform 0.2s ease-in-out";
        zoneSlots.style.transform = "scale(1.01)";
        setTimeout(() => { zoneSlots.style.transform = "scale(1)"; }, 200);
      }
    });

    resultsGrid.appendChild(card);
  });
}

function initialiserClicSlots() {
  const slots = document.querySelectorAll('.team-slot');
  const zoneAvancee = document.getElementById('advanced-search-zone');
  if (!zoneAvancee) return;

  slots.forEach(function(slot) {
    slot.addEventListener('click', function() {
      if (slot.classList.contains('empty')) {
        zoneAvancee.classList.remove('hidden');
        zoneAvancee.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initResetAdvanced() {
  const btnReset = document.getElementById('btn-reset-advanced');
  const zoneAvancee = document.getElementById('advanced-search-zone');
  const resultsContainer = document.getElementById('advanced-results-container');
  if (!btnReset || !zoneAvancee) return;

  btnReset.addEventListener('click', function() {
    const zoneSlots = document.getElementById('team-slots');
    if (zoneSlots) {
      zoneSlots.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    zoneAvancee.classList.add('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
  });
}

function initClearAdvancedButton() {
  const btnClear = document.getElementById('btn-clear-advanced');
  const resultsContainer = document.getElementById('advanced-results-container');
  if (!btnClear) return;

  btnClear.addEventListener('click', function() {
    document.querySelectorAll('#advanced-search-zone input').forEach(function(input) { input.value = ''; });
    document.querySelectorAll('#advanced-search-zone select').forEach(function(select) { select.selectedIndex = 0; });
    
    gererDesactivationTypes();

    if (resultsContainer) {
      resultsContainer.classList.add('hidden');
    }
    
    showMessage("🔄 Filtres réinitialisés !", "info");
  });
}

function initAdvancedSearchButton() {
  const btnSearch = document.getElementById('btn-search-advanced');
  if (btnSearch) {
    btnSearch.addEventListener('click', executerRechercheAvancee);
  }
}

function initAutoSearchOnStats() {
  const statElements = document.querySelectorAll('.stats-group input[type="number"], .stats-group select');
  
  statElements.forEach(function(element) {
    element.addEventListener('change', function() {
      executerRechercheAvancee();
    });
  });
}

function initAutoSearchOnTypesAndRelations() {
  const selectType1 = document.getElementById('filter-type1');
  const selectType2 = document.getElementById('filter-type2');
  const selectTalent = document.getElementById('filter-talent');
  
  if (selectType1) {
    selectType1.addEventListener('change', function() {
      gererDesactivationTypes(); 
      executerRechercheAvancee();
    });
  }
  if (selectType2) {
    selectType2.addEventListener('change', function() {
      gererDesactivationTypes(); 
      executerRechercheAvancee();
    });
  }

  if (selectTalent) {
    selectTalent.addEventListener('change', function() {
      executerRechercheAvancee();
    });
  }

  const relationSelects = document.querySelectorAll('.filter-relation');
  relationSelects.forEach(function(select) {
    select.addEventListener('change', function() {
      executerRechercheAvancee();
    });
  });
}

// ============================================================
// 10. DÉMARRAGE GLOBAL
// ============================================================
window.addEventListener("DOMContentLoaded", function() {
  initSearch();
  updateDefenseTable();
  genererFiltresAvances(); 
  gererDesactivationTypes(); 
  initialiserClicSlots();
  initResetAdvanced();
  initClearAdvancedButton();
  initAutoSearchOnStats();
  initAutoSearchOnTypesAndRelations(); 
  initAdvancedSearchButton();
});