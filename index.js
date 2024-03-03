let imagesContainerDiv = document.getElementById("imagesContainer");

document
  .getElementById("leagueDataButton")
  .addEventListener("click", function () {
    getRequestToServer();
  });

function getRequestToServer() {
  leagueData = fetch("http://localhost:8080/items")
    .then((res) => res.json())
    .then((fullJsonResponse) => {
      const data = fullJsonResponse.data;
      renderItems(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderItems(data) {
  for (itemId in data) {
    let currentItem = data[itemId];
    let itemDiv = document.createElement("div");
    itemDiv.setAttribute("id", `${itemId}-maindiv`);
    itemDiv.setAttribute("class", "itemDiv");
    let itemInformationDiv = document.createElement("div");
    itemInformationDiv.setAttribute("id", `${itemId}-description`);
    itemInformationDiv.setAttribute("class", `itemDescription`);
    addImageWithItemIdAndSize(itemDiv, itemId, "large");
    addH2TagWithName(itemInformationDiv, currentItem.name);
    addPTagWithDescription(itemInformationDiv, currentItem.description);
    addPTagWithIntoArray(itemInformationDiv, data, currentItem.into);
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
function addPTagWithIntoArray(thisObject, data, itemsUpgradableInto) {
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
  let itemDiv = document.getElementById(`${itemId}-description`);
  itemDiv.style.display = "none";
}

function showDescription(itemId) {
  let itemDiv = document.getElementById(`${itemId}-description`);
  itemDiv.style.display = "block";
}

function addPTagWithCost(thisObject, gold) {
  if (gold.total) {
    const costPTag = document.createElement("p");
    costPTag.setAttribute("class", "cost");
    costPTag.innerHTML = `Cost: <span class="goldTextHighlight">${gold.total} (${gold.sell})</span>`;
    thisObject.appendChild(costPTag);
  }
}
