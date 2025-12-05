// Your existing recipes array (unchanged)
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    description: "Simple pasta with tomato sauce.",
    ingredients: ["pasta", "tomato sauce", "salt", "olive oil"],
    steps: [
      "Boil water and cook pasta according to package instructions.",
      "Heat olive oil in a pan and add tomato sauce.",
      "Combine pasta with sauce and serve."
    ]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    steps: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat oil in a pan over medium heat.",
      "Add vegetables and stir-fry for 5-7 minutes.",
      "Add soy sauce and cook for another 2 minutes."
    ]
  },
  {
    id: 3,
    name: "Chicken Tacos",
    description: "Tortillas filled with seasoned chicken and toppings.",
    ingredients: ["chicken", "taco shells", "lettuce", "cheese", "salsa"],
    steps: [
      "Cook chicken in a pan with your favorite seasoning.",
      "Warm taco shells in the oven.",
      "Assemble tacos with chicken, lettuce, cheese, and salsa."
    ]
  }
];

// This will store the IDs of favorite recipes
let favoriteIds = [];

let userHistory = {
  viewed: [],              
  favorites: [...favoriteIds]
};

// Get references to the HTML elements
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById(
  "favorites-empty-message"
);

// -------------------- NEW: Recipe Detail View --------------------
// Add after your element references

function showRecipeDetail(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Hide other sections
  document.getElementById("recipes-list").parentElement.style.display = "none";
  document.getElementById("favorites-list").parentElement.style.display = "none";
  const recSection = document.getElementById("recommendations-list");
  if (recSection) recSection.parentElement.style.display = "none";

  // Show detail section
  const detailSection = document.getElementById("recipe-detail-section");
  detailSection.style.display = "block";

  // Populate detail content
  document.getElementById("detail-title").textContent = recipe.name;

  const ingList = document.getElementById("detail-ingredients");
  ingList.innerHTML = "";
  recipe.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing;
    ingList.appendChild(li);
  });

  const stepList = document.getElementById("detail-steps");
  stepList.innerHTML = "";
  recipe.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepList.appendChild(li);
  });

  // Track as viewed
  if (!userHistory.viewed.includes(recipeId)) {
    userHistory.viewed.push(recipeId);
  }
}

// Back button
document.getElementById("back-to-list").addEventListener("click", () => {
  document.getElementById("recipes-list").parentElement.style.display = "block";
  document.getElementById("favorites-list").parentElement.style.display = "block";
  const recSection = document.getElementById("recommendations-list");
  if (recSection) recSection.parentElement.style.display = "block";

  document.getElementById("recipe-detail-section").style.display = "none";
});

// -------------------- END Recipe Detail View --------------------


// Render all recipes with a favorite button
function renderRecipes() {
  recipesListEl.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    // When card is clicked, show recipe detail
    card.addEventListener("click", () => {
      showRecipeDetail(recipe.id);
    });

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

    // Favorite button click (unchanged)
    favButton.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent card click triggering detail view
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

// Render favorites (unchanged)
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

// Toggle favorite (unchanged)
function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) {
    favoriteIds = favoriteIds.filter((id) => id !== recipeId);
  } else {
    favoriteIds.push(recipeId);
  }

  userHistory.favorites = [...favoriteIds]; // keep history updated

  renderRecipes();
  renderFavorites();
}

// Initial render
renderRecipes();
renderFavorites();

