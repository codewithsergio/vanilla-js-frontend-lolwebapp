let imagesContainerDiv = document.getElementById("imagesContainer");
let data;
let rawData;
let searchedData;

function updateUserInputSearch(search) {
  searchedData = jmespath.search(data, `[?contains(name, '${search}')]`);
  if (search === "") {
    renderItems(data);
  } else {
    renderItems(searchedData);
  }
}

let searchInputField = document.getElementById("itemSearchElement");
searchInputField.addEventListener("input", function (event) {
  updateUserInputSearch(this.value);
});

document
  .getElementById("leagueDataButton")
  .addEventListener("click", function () {
    getRequestToServer();
  });

function getRequestToServer() {
  leagueData = fetch("http://localhost:8080/items")
    .then((res) => res.json())
    .then((fullJsonResponse) => {
      rawData = fullJsonResponse.data;
      data = jmespath.search(fullJsonResponse, `data.*`);
      renderItems(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderItems(data) {
  imagesContainerDiv.innerHTML = "";
  for (index in data) {
    let itemId = data[index].id;
    let currentItem = data[index];
    let itemDiv = document.createElement("div");
    itemDiv.setAttribute("id", `${itemId}-maindiv`);
    itemDiv.setAttribute("class", "itemDiv");
    let itemInformationDiv = document.createElement("div");
    itemInformationDiv.setAttribute("id", `${itemId}-description`);
    itemInformationDiv.setAttribute("class", "itemTooltip");
    addImageWithItemIdAndSize(itemDiv, itemId, "large");
    addH2TagWithName(itemInformationDiv, currentItem.name);
    addPTagWithDescription(itemInformationDiv, currentItem.description);
    addDivTagWithIntoArray(itemInformationDiv, rawData, currentItem.into);
    addPTagWithCost(itemInformationDiv, currentItem.gold);
    itemDiv.appendChild(itemInformationDiv);
    imagesContainerDiv.appendChild(itemDiv);
  }
}

function addImageWithItemIdAndSize(thisObject, itemId, size) {
  const image = document.createElement("img");
  image.setAttribute("src", `itemImages/${itemId}.png`);
  image.setAttribute("class", `${size}-item-image-size`);
  if (size === "large") {
    image.addEventListener("mouseover", function () {
      showDescription(itemId);
    });
    image.addEventListener("mouseout", function () {
      hideDescription(itemId);
    });
  }
  thisObject.appendChild(image);
}

function addH2TagWithName(thisObject, itemName) {
  const title = document.createElement("h2");
  title.setAttribute("class", "itemTitle");
  title.innerHTML = itemName;
  thisObject.appendChild(title);
}

// * Takes in html elements and text as string
// @return div with description html elements
function addPTagWithDescription(thisObject, description) {
  const descriptionObject = document.createElement("div");
  descriptionObject.setAttribute("class", "itemHTMLData");
  descriptionObject.innerHTML = description;
  thisObject.appendChild(descriptionObject);
}

// * Takes in an array of strings
// @return div holding list of p tags
function addDivTagWithIntoArray(thisObject, data, itemsUpgradableInto) {
  const intoObject = document.createElement("div");
  intoObject.setAttribute("class", "intoList");
  for (itemIndex in itemsUpgradableInto) {
    let idOfIntoItem = itemsUpgradableInto[itemIndex];
    if (data[idOfIntoItem]) {
      addImageWithItemIdAndSize(intoObject, idOfIntoItem, "small");
    }
  }
  thisObject.appendChild(intoObject);
}

function hideDescription(itemId) {
  let itemDescriptionDiv = document.getElementById(`${itemId}-description`);
  itemDescriptionDiv.style.display = "none";
  itemDescriptionDiv.classList.remove("imageAboveItem");
}

function showDescription(itemId) {
  let itemDescriptionDiv = document.getElementById(`${itemId}-description`);
  itemDescriptionDiv.style.display = "block";
  const { top, bottom } = itemDescriptionDiv.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  if (viewportHeight < bottom) {
    itemDescriptionDiv.classList.add("imageAboveItem");
  }
}

function addPTagWithCost(thisObject, gold) {
  if (gold.total) {
    const costPTag = document.createElement("p");
    costPTag.setAttribute("class", "cost");
    costPTag.innerHTML = `Cost: <span class="goldTextHighlight">${gold.total} (${gold.sell})</span>`;
    thisObject.appendChild(costPTag);
  }
}
