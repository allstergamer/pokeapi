
let allPokemon = [];

async function loadPokemons() {
    try {
        const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // erste 151
        const listData = await listRes.json();
        allPokemon = listData.results; // {name, url}
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
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const detailDiv = document.getElementById("pokemonDetail");
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Pokémon nicht gefunden");
        const data = await res.json();
        const types = data.types.map(t => t.type.name).join(', ');
        const abilities = data.abilities.map(a => a.ability.name).join(', ');

        detailDiv.innerHTML = `
            <h3>${capitalize(data.name)}</h3>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Typen: ${types}</p>
            <p>HP: ${data.stats[0].base_stat}</p>
            <p>Angriff: ${data.stats[1].base_stat}</p>
            <p>Verteidigung: ${data.stats[2].base_stat}</p>
            <p>Fähigkeiten: ${abilities}</p>
        `;
    } catch (err) {
        detailDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

function searchPokemon() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const found = allPokemon.find(p => p.name === query);
    if (found) {
        loadPokemonDetail(found.name);
    } else {
        document.getElementById("pokemonDetail").innerHTML = `<p style="color:red">Pokémon nicht gefunden</p>`;
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
