const typeList = document.getElementsByClassName("nav-list");

const types = [
  "All",
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dark",
  "Dragon",
  "Steel",
  "Fairy",
];

function addChild(type) {
  let li = document.createElement("li");
  li.classList.add("nav-item");
  typeList[0].appendChild(li);

  let button = document.createElement("button");
  button.setAttribute("id", type.toLowerCase());
  button.classList.add("btn", "btn-header");
  if (type != "All") {
    button.classList.add(type.toLowerCase());
  }
  button.textContent = type;
  li.appendChild(button);
}

types.map((type) => addChild(type));
