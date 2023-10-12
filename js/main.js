const pokemonList = document.querySelector("#pokemonList");
const buttonsHeader = document.querySelectorAll(".btn-header");
const buttonShowMore = document.querySelector(".btn-more");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const numPokemon = 1016; //Number of pokemon data available in through pokeAPI
let cancelButtons = []; //Buttons selected by user
let pokemonCards = [];
let tagList = []; //Tags selected by the user
let curr = 1; //The current number of pokemon which needs to taken from pokeAPI

function getData(initial, final) {
  for (let i = initial; i < final && i <= numPokemon; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then((data) => pokemonMonster(data));
  }
  curr = final; //Changing the value of pokemon to be taken next
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

  //Adding the pokemon card
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

  //To display a particular card or not based on the selected tags
  if (tagList.length !== 0) display(div);
}

function display(pokemon) {
  const types = pokemon.querySelector(".pokemon-types").innerHTML; //Types of a pokemon

  if (tagList.length === 0) {
    pokemon.style.display = "block"; //All cards displayed
  } else if (
    (tagList.length === 1 && !types.includes(tagList[0])) ||
    (tagList.length === 2 &&
      (!types.includes(tagList[0]) || !types.includes(tagList[1])))
  ) {
    pokemon.style.display = "none"; //If the types of pokemon do not match the types selected by the user
  } else {
    pokemon.style.display = "block"; //In case the user deselects a tag, to show the hidden card again
  }
}

buttonsHeader.forEach((button) =>
  button.addEventListener("click", (event) => {
    const buttonId = event.currentTarget.id; //id of the selected button

    //A pokemon cannot have more than two types
    if (tagList.length >= 2 && buttonId !== "all") {
      alert("You can only select 2 tags at a time.");
      return;
    }

    pokemonCards = document.querySelectorAll(".pokemon"); //Selecting all pokemon cards
    if (buttonId === "all") {
      //Show all cards
      tagList.splice(0); //Empty the tagList
      tags.innerHTML = "";
      tags.style.display = "none"; //HTML element with class "tags should not be displayed"
      pokemonCards.forEach((pokemon) => display(pokemon));
    } else {
      tags.innerHTML = "Selected tags:";
      tagList.push(buttonId); //Include the selected tag in the tagList

      //Show the selected tag on the website
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

      tags.style.display = "flex";

      cancelButtons = document.querySelectorAll(".cancel");
      cancelTag(cancelButtons); //Add the event listener to the selected tags

      pokemonCards.forEach((pokemon) => display(pokemon));
    }
  })
);

buttonShowMore.addEventListener("click", () => {
  getData(curr, curr + 100);
  if (curr + 100 > numPokemon) {
    //Maximum number of pokemons available reached
    buttonShowMore.disabled = true;
    buttonShowMore.textContent = "You have reached the end of the list";
  }
});

function cancelTag(cancelButtons) {
  //Put the event listener in a function because "cancelButtons" element changes
  cancelButtons.forEach((cancel) =>
    cancel.addEventListener("click", (event) => {
      if (tagList.length === 1) {
        //Remove the selected tags and show all cards
        tagList.splice(0);
        tags.innerHTML = "";
        tags.style.display = "none";
        pokemonCards.forEach((pokemon) => display(pokemon));
      } else if (tagList.length === 2) {
        const buttonId = event.currentTarget.id; //id of the button clicked
        if (tagList[0] === buttonId) {
          tagList.shift(); //Remove first tag
        } else {
          tagList.pop(); //Remove second tag
        }

        //Remove the selected tag
        tags.querySelector(`.${buttonId}`).remove();

        cancelButtons = document.querySelectorAll(".cancel");
        cancelTag(cancelButtons); //Add the event listener to the new tags

        pokemonCards.forEach((pokemon) => display(pokemon));
      }
    })
  );
}

//Fetch data for the first 100 pokemons automatically when the website is loaded
getData(curr, curr + 100);
