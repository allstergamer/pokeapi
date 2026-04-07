let allPokemon = [];
let germanToEnglish = {};
let englishToGerman = {};
let germanToEnglishType = {};
let englishToGermanType = {};
let currentPokemonIndex = 0;

function hideLoader() {
  const loader = document.getElementById("loadingScreen");

  loader.classList.add("fade-out");

  loader.addEventListener("transitionend", () => {
    loader.style.display = "none";
  });
}


async function loadPokemons() {
    try {
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const listData = await listRes.json();
        allPokemon = listData.results;

        // Deutsches Mapping parallel holen
        await Promise.all(allPokemon.map(async (p) => {
            try {
                const res = await fetch(p.url);
                const data = await res.json();
                const speciesRes = await fetch(data.species.url);
                const speciesData = await speciesRes.json();
                const germanEntry = speciesData.names.find(n => n.language.name === "de");
                if (germanEntry) {
                    germanToEnglish[germanEntry.name.toLowerCase()] = data.name;
                    englishToGerman[data.name] = germanEntry.name;
                }
            } catch (e) {
                console.error("Mapping Fehler:", p.name, e);
            }
        }));

        hideLoader();
        renderPokemonList();
    } catch (err) {
        console.error(err);
        document.getElementById("pokemonList").innerText = "Fehler beim Laden";
    }
}

function renderPokemonList() {
    const listDiv = document.getElementById("pokemonList");


    allPokemon.forEach((p, index) => {
        const germanName = englishToGerman[p.name] || capitalize(p.name);
        const div = document.createElement("div");
        div.className = "pokemonItem";
        const dex = String(index + 1).padStart(4, "0");
        div.innerHTML = `
            <span class="dex">${dex}</span>
            <span class="german">${germanName}</span>
            <span class="english">${capitalize(p.name)}</span>
        `;
        div.onclick = () => loadPokemonDetail(p.name); // API braucht englischen Namen
        listDiv.appendChild(div);
        
    });
}
// Pokémon Detail laden beim anklicken in der liste oder beim suchen
async function loadPokemonDetail(name) {
    currentPokemonIndex = allPokemon.findIndex(p => p.name === name);
    const detailDiv = document.getElementById("pokemonDetail");

    try {
        // 1️⃣ Basisdaten
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Pokémon nicht gefunden");
        const data = await res.json();

        // 2️⃣ Species (für deutsche Namen + Beschreibung)
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        // Deutscher Name
        const germanNameEntry = speciesData.names.find(n => n.language.name === "de");
        const germanName = germanNameEntry ? germanNameEntry.name : capitalize(data.name);

        // Deutsche Beschreibung
        const germanTextEntry = speciesData.flavor_text_entries.find(
            f => f.language.name === "de"
        );
        // Deutsche Typen 
        const englishToGermanType = speciesData.flavor_text_entries.find(
            f => f.language.name === "de"
        );
        const description = germanTextEntry 
            ? germanTextEntry.flavor_text.replace(/\f/g, " ")
            : "Keine Beschreibung";

        // Typen
        const types = await Promise.all(
            data.types.map(async (t) => {
                const typeRes = await fetch(t.type.url);
                const typeData = await typeRes.json();

                const germanType = typeData.names.find(n => n.language.name === "de");
                return germanType ? germanType.name.toLowerCase() : t.type.name;
            })
        );

const typesHTML = types.map(t => 
    `<span class="type ${t}">${capitalize(t)}</span>`
).join('');

const typesString = types.join(', ');



        // Fähigkeiten
        const abilities = await Promise.all(
            data.abilities.map(async (a) => {
                const abilityRes = await fetch(a.ability.url);
                const abilityData = await abilityRes.json();

                const germanAbility = abilityData.names.find(n => n.language.name === "de");
                return germanAbility ? germanAbility.name : a.ability.name;
            })
        );

const abilitiesString = abilities.join(', ');



        // Stats
        const stats = data.stats.map(s => `
            <p>${capitalize(s.stat.name)}: ${s.base_stat}</p>
        `).join("");

        // HTML bauen
            detailDiv.innerHTML = `
            <div class="pokemon-detail-container">
            
            <img src="${data.sprites.front_default}" alt="${data.name}">
            
            <div class="pokemon-info-block">
            <h2>${germanName} (${capitalize(data.name)})</h2>
            <p><strong>Typen:</strong> ${typesHTML}</p>
            <p><strong>DEX nummer:</strong> ${String(data.id).padStart(4, "0")}</p>
            <p><strong>Größe:</strong> ${data.height / 10} m</p>
            <p><strong>Gewicht:</strong> ${data.weight / 10} kg</p>
            <p><strong>Fähigkeiten:</strong> ${abilitiesString}</p>
            </div>
            
            <div class="pokemon-stats-block">
            <h3>Stats</h3>
            ${stats}
            </div>
            
            <div class="pokemon-description-block">
            <h3>Beschreibung</h3>
            <p>${description}</p>
            </div>

        </div>
    `;
        document.getElementById("searchInput").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } catch (err) {
        detailDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
    document.querySelector(".details-header button:first-child").disabled = currentPokemonIndex === 0;
    document.querySelector(".details-header button:last-child").disabled = currentPokemonIndex === allPokemon.length - 1;
    
}

function nextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        currentPokemonIndex++;
        loadPokemonDetail(allPokemon[currentPokemonIndex].name);
    }
}

function prevPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        loadPokemonDetail(allPokemon[currentPokemonIndex].name);
    }
}
// Suchfunktion ueber den details

// 🔹 Suchfunktion für deutsche und englische Namen
// 🔹 Suchfunktion für deutsche und englische Namen
function searchPokemon() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    let apiName = germanToEnglish[query]; // DE → EN Mapping

    if (!apiName) {
        const found = allPokemon.find(p => p.name.toLowerCase() === query);
        if (found) apiName = found.name;
    }

    if (apiName) {
        loadPokemonDetail(apiName);
    } else {
        document.getElementById("pokemonDetail").innerHTML = `<p style="color:red">Pokémon nicht gefunden</p>`;
    }
}

// 🔹 Enter-Taste registrieren (nur einmal beim Laden)
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchPokemon();
    }
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🔹 Seite laden
window.onload = loadPokemons;






