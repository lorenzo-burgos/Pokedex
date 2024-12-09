class Pokemon {
    number;
    name;
    type;
    types = [];
    image;
}

const generationRanges = {
    gen1: [1, 151],
    gen2: [152, 251],
    gen3: [252, 386],
    gen4: [387, 493],
    gen5: [494, 649],
    gen6: [650, 721],
    gen7: [722, 809],
    gen8: [810, 905],
};

function createButtons() {
    const buttonContainer = document.getElementById("buttons");

    Object.keys(generationRanges).forEach((gen) => {
        const button = document.createElement("button");
        button.textContent = gen.toUpperCase();
        button.onclick = async () => {
            const [start, end] = generationRanges[gen];
            const pokemons = await fetchPokemonByRange(start, end);
            renderPokemon(pokemons);
        };
        buttonContainer.appendChild(button);
    });
}

createButtons();

async function fetchPokemonByRange(start, end) {
    const baseURL = "https://pokeapi.co/api/v2/pokemon/";
    const limit = end - start + 1;
    const offset = start - 1;

    try {
        const response = await fetch(`${baseURL}?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return res.json();
            })
        );

        return pokemonDetails;
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return [];
    }
}

function renderPokemon(pokemons) {
    const pokemonList = document.querySelector(".pokemons");
    pokemonList.innerHTML = "";

    pokemons.forEach((pokemon) => {
        const listItem = document.createElement("li");
        listItem.classList.add("pokemon");

        const typesHTML = pokemon.types
            .map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`)
            .join("");

        listItem.innerHTML = `
            <span class="number">#${String(pokemon.id).padStart(3, "0")}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">${typesHTML}</ol>
                <img src="${pokemon.sprites.other["dream_world"].front_default}" alt="${pokemon.name}">
            </div>
        `;

        pokemonList.appendChild(listItem);
    });
}
