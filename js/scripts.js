let allPokemon = [];
let germanToEnglish = {}; // DE -> EN Mapping

async function loadPokemons() {
    try {
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // oder 1025
        const listData = await listRes.json();
        allPokemon = listData.results; // {name, url}

        // Mapping aufbauen
        for (let p of allPokemon) {
            try {
                const res = await fetch(p.url);
                const data = await res.json();

                const speciesRes = await fetch(data.species.url);
                const speciesData = await speciesRes.json();

                const germanEntry = speciesData.names.find(n => n.language.name === "de");
                if (germanEntry) {
                    germanToEnglish[germanEntry.name.toLowerCase()] = data.name; // DE → EN
                }
            } catch (e) {
                console.error("Mapping Fehler:", p.name, e);
            }
        }

        renderPokemonList();
    } catch (err) {
        console.error(err);
        document.getElementById("pokemonList").innerText = "Fehler beim Laden";
    }
}

function renderPokemonList() {
    const listDiv = document.getElementById("pokemonList");
    listDiv.innerHTML = "";
    allPokemon.forEach(p => {
        const div = document.createElement("div");
        div.className = "pokemonItem";
        div.innerText = capitalize(p.name);
        div.onclick = () => loadPokemonDetail(p.name);
        listDiv.appendChild(div);
    });
}
async function loadPokemonDetail(name) {
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
        const description = germanTextEntry 
            ? germanTextEntry.flavor_text.replace(/\f/g, " ")
            : "Keine Beschreibung";

        // Typen
        const types = data.types.map(t => t.type.name).join(', ');

        // Fähigkeiten
        const abilities = data.abilities.map(a => a.ability.name).join(', ');

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
                <p><strong>Typen:</strong> ${types}</p>
                <p><strong>Größe:</strong> ${data.height / 10} m</p>
                <p><strong>Gewicht:</strong> ${data.weight / 10} kg</p>
                <p><strong>Fähigkeiten:</strong> ${abilities}</p>
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
    } catch (err) {
        detailDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

function searchPokemon() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();

    let apiName = germanToEnglish[query]; // zuerst deutsches Mapping

    if (!apiName) {
        // fallback: englischer Name direkt
        const found = allPokemon.find(p => p.name === query);
        if (found) apiName = found.name;
    }

    if (apiName) {
        loadPokemonDetail(apiName);
    } else {
        document.getElementById("pokemonDetail").innerHTML =
            `<p style="color:red">Pokémon nicht gefunden</p>`;
    }
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Beim Laden der Seite
window.onload = loadPokemons;




const pokedex = document.getElementById('pokedex');
const pokemons = {};

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(pokemon => {
      pokemons[pokemon.Id] = pokemon;
      renderPokemon(pokemon.Id);
    });
  });

function renderPokemon(id) {
  const pokemon = pokemons[id];

  const card = document.createElement('div');
  card.className = 'card';

  const image = document.createElement('img');
  image.src = pokemon.Imagen;
  image.alt = pokemon.Nombre;

  const name = document.createElement('h2');
  name.textContent = pokemon.Nombre;

  const type = document.createElement('p');
  type.className = 'pokemon-type';
  type.textContent = `Tipo: ${pokemon.Tipo}`;

  const description = document.createElement('p');
  description.className = 'pokemon-description';
  description.textContent = `Descripción: ${pokemon.Descripción}`;

  const info = document.createElement('div');
  info.className = 'pokemon-info';

  const height = document.createElement('p');
  height.textContent = `Altura: ${pokemon.Altura} m`;

  const weight = document.createElement('p');
  weight.textContent = `Peso: ${pokemon.Peso} kg`;

  const imageInfo = document.createElement('img');
  imageInfo.src = pokemon.ImagenInfo;
  imageInfo.alt = 'Imagen de información';

  imageInfo.addEventListener('click', () => {
    showPokemonInfo(pokemon);
  });

  info.appendChild(height);
  info.appendChild(weight);
  info.appendChild(imageInfo);

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(type)
  card.appendChild(description);
  card.appendChild(info);

  pokedex.appendChild(card);
}
