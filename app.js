// Simple mock recipe data.
// Later your team can expand this for the other issues.
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    description: "Simple pasta with tomato sauce."
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce."
  },
  {
    id: 3,
    name: "Chicken Tacos",
    description: "Tortillas filled with seasoned chicken and toppings."
  }
];

// This will store the IDs of favorite recipes
let favoriteIds = [];

// Get references to the HTML elements
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById(
  "favorites-empty-message"
);

// Render all recipes with a favorite button
function renderRecipes() {
  recipesListEl.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const favButton = document.createElement("button");
    favButton.className = "favorite-button";

    const isFavorite = favoriteIds.includes(recipe.id);
    favButton.textContent = isFavorite ? "★ Favorited" : "☆ Favorite";
    if (isFavorite) {
      favButton.classList.add("favorited");
    }

    favButton.addEventListener("click", () => {
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(favButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    recipesListEl.appendChild(card);
  });
}

// Render the favorites section
function renderFavorites() {
  favoritesListEl.innerHTML = "";

  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  if (favoriteRecipes.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    return;
  }

  favoritesEmptyMessageEl.style.display = "none";

  favoriteRecipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const removeButton = document.createElement("button");
    removeButton.className = "favorite-button favorited";
    removeButton.textContent = "Remove ★";

    removeButton.addEventListener("click", () => {
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(removeButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    favoritesListEl.appendChild(card);
  });
}

// Add or remove a recipe from favorites
function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) {
    // remove it
    favoriteIds = favoriteIds.filter((id) => id !== recipeId);
  } else {
    // add it
    favoriteIds.push(recipeId);
  }

  // Re-render both sections
  renderRecipes();
  renderFavorites();
}

// Initial render when the page loads
renderRecipes();
renderFavorites();
