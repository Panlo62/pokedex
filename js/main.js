const pokemonList = document.querySelector("#pokemonList");
const buttonsHeader = document.querySelectorAll(".btn-header");
const buttonShowMore = document.querySelector(".btn-more");
const tags = document.querySelector("#tags");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const numPokemon = 1016;
let start = 1;
let tagList = [];

function getData(initial, final) {
  for (let i = initial; i < final && i <= numPokemon; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then((data) => pokemonMonster(data));
  }
  start = final;
}

function pokemonMonster(poke) {
  console.log(poke);
  let types = poke.types.map(
    (type) => `<p class="${type.type.name} type">${type.type.name}</p>`
  );
  types = types.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-image">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="container">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-name">${poke.name}</h2>
            </div>
            <div class="pokemon-types">
                ${types}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
  pokemonList.append(div);
}

buttonsHeader.forEach((button) =>
  button.addEventListener("click", (event) => {
    const buttonId = event.currentTarget.id;
    if (tagList.length >= 2) {
      alert("You can only choose two tags at a time.");
      return;
    }

    tagList.push(buttonId);
    pokemonList.innerHTML = "";
    for (let i = 1; i < start && i <= numPokemon; i++) {
      fetch(URL + i)
        .then((response) => response.json())
        .then((data) => {
          if (buttonId === "all") {
            pokemonMonster(data);
          } else {
            const types = data.types.map((type) => type.type.name);
            if (types.includes(buttonId)) {
              pokemonMonster(data);
            }
          }
        });
    }
  })
);

buttonShowMore.addEventListener("click", () => {
  getData(start, start + 100);
  if (start + 100 > numPokemon) {
    buttonShowMore.disabled = true;
    buttonShowMore.textContent = "You have reached the end of the list";
  }
});

getData(start, start + 100);
