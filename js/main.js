const pokemonList = document.querySelector("#pokemonList");
const buttonsHeader = document.querySelectorAll(".btn-header");
const buttonShowMore = document.querySelector(".btn-more");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const numPokemon = 1016;
let cancelButtons = [];
let pokemonCards = [];
let tagList = [];
let start = 1;

function getData(initial, final) {
  for (let i = initial; i < final && i <= numPokemon; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then((data) => pokemonMonster(data));
  }
  start = final;
}

function pokemonMonster(poke) {
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

  if (tagList.length !== 0) noneDisplay(div);
}

function noneDisplay(pokemon) {
  const types = pokemon.querySelector(".pokemon-types").innerHTML;

  if (tagList.length === 0) {
    pokemon.style.display = "block";
  } else if (
    (tagList.length === 1 && !types.includes(tagList[0])) ||
    (tagList.length === 2 &&
      (!types.includes(tagList[0]) || !types.includes(tagList[1])))
  ) {
    pokemon.style.display = "none";
  } else {
    pokemon.style.display = "block";
  }
}

buttonsHeader.forEach((button) =>
  button.addEventListener("click", (event) => {
    const buttonId = event.currentTarget.id;
    if (tagList.length >= 2 && buttonId !== "all") {
      alert("You can only choose two tags at a time.");
      return;
    }

    pokemonCards = document.querySelectorAll(".pokemon");
    if (buttonId === "all") {
      tagList.splice(0);
      tags.innerHTML = "";
      tags.style.display = "none";
      pokemonCards.forEach((pokemon) => noneDisplay(pokemon));
    } else {
      tags.innerHTML = "Selected tags:";
      tagList.push(buttonId);

      tagList.map((tag) => {
        let li = document.createElement("li");
        li.classList.add("nav-item");
        tags.appendChild(li);
        li.innerHTML = `
          <button id="${tag.toLowerCase()}" class="btn btn-header cancel ${
          tag != "all" ? tag.toLowerCase() : ""
        }">${tag}</button>
        `;
      });

      cancelButtons = document.querySelectorAll(".cancel");
      cancelTag(cancelButtons);
      tags.style.display = "flex";

      pokemonCards.forEach((pokemon) => noneDisplay(pokemon));
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

function cancelTag(cancelButtons) {
  cancelButtons.forEach((cancel) =>
    cancel.addEventListener("click", (event) => {
      if (tagList.length === 1) {
        tagList.splice(0);
        tags.innerHTML = "";
        tags.style.display = "none";
        pokemonCards.forEach((pokemon) => noneDisplay(pokemon));
      } else {
        const buttonId = event.currentTarget.id;
        if (tagList[0] === buttonId) {
          tagList.shift();
        } else {
          tagList.pop();
        }
        tags.innerHTML = "Selected tags:";

        tagList.map((tag) => {
          let li = document.createElement("li");
          li.classList.add("nav-item");
          tags.appendChild(li);
          li.innerHTML = `
          <button id="${tag.toLowerCase()}" class="btn btn-header cancel ${
            tag != "all" ? tag.toLowerCase() : ""
          }">${tag}</button>
        `;
        });

        cancelButtons = document.querySelectorAll(".cancel");
        cancelTag(cancelButtons);
        pokemonCards.forEach((pokemon) => noneDisplay(pokemon));
      }
    })
  );
}

getData(start, start + 100);
