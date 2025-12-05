// -------------------- Recipe Data --------------------
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
    ],
    tags: ["vegetarian", "quick"]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    steps: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat oil in a pan over medium heat.",
      "Add vegetables and stir-fry for 5–7 minutes.",
      "Add soy sauce and cook for another 2 minutes."
    ],
    tags: ["vegetarian", "low-fat", "quick"]
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
    ],
    tags: ["high-protein"]
  }
];

// -------------------- State --------------------
let favoriteIds = JSON.parse(localStorage.getItem("favoriteIds") || "[]");
let userHistory = JSON.parse(localStorage.getItem("userHistory") || '{"viewed":[],"favorites":[]}');
let dietaryFilters = [];

// -------------------- Element References --------------------
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const recipeDetailSection = document.getElementById("recipe-detail-section");
const detailTitleEl = document.getElementById("detail-title");
const detailIngredientsEl = document.getElementById("detail-ingredients");
const detailStepsEl = document.getElementById("detail-steps");
const detailMetaEl = document.getElementById("detail-meta");
const tabsNav = document.querySelectorAll(".tab-button");
const planDaysEl = document.getElementById("plan-days");
const generatePlanBtn = document.getElementById("generate-plan");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const dietaryCheckboxes = document.querySelectorAll("#dietary-filters input[type='checkbox']");
const clearFiltersBtn = document.getElementById("clear-filters");
const noResultsEl = document.getElementById("no-results");

// -------------------- Utilities --------------------
function saveState() {
  localStorage.setItem("favoriteIds", JSON.stringify(favoriteIds));
  localStorage.setItem("userHistory", JSON.stringify(userHistory));
}

// -------------------- Tabs --------------------
tabsNav.forEach(tab => {
  tab.addEventListener("click", () => {
    tabsNav.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    document.querySelectorAll(".tab-section").forEach(sec => {
      sec.style.display = sec.id === target ? "block" : "none";
    });
  });
});

// -------------------- Favorites --------------------
function toggleFavorite(id) {
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(fid => fid !== id);
  } else {
    favoriteIds.push(id);
  }
  userHistory.favorites = [...favoriteIds];
  saveState();
  renderRecipes();
  renderFavorites();
  renderRecommendations();
}

function renderFavorites() {
  favoritesListEl.innerHTML = "";
  const favs = recipes.filter(r => favoriteIds.includes(r.id));
  if (favs.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    return;
  }
  favoritesEmptyMessageEl.style.display = "none";

  favs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const removeBtn = document.createElement("button");
    removeBtn.className = "favorite-button favorited";
    removeBtn.textContent = "Remove ★";
    removeBtn.addEventListener("click", () => toggleFavorite(recipe.id));

    header.appendChild(title);
    header.appendChild(removeBtn);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    favoritesListEl.appendChild(card);
  });
}

// -------------------- Recipes --------------------
function filterRecipes() {
  let filtered = recipes;

  // Dietary filters
  if (dietaryFilters.length > 0) {
    filtered = filtered.filter(r => dietaryFilters.some(tag => r.tags.includes(tag)));
  }

  return filtered;
}

function renderRecipes() {
  recipesListEl.innerHTML = "";
  const filtered = filterRecipes();

  if (filtered.length === 0) {
    noResultsEl.style.display = "block";
    return;
  } else {
    noResultsEl.style.display = "none";
  }

  filtered.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const favBtn = document.createElement("button");
    favBtn.className = "favorite-button";
    favBtn.textContent = favoriteIds.includes(recipe.id) ? "★ Favorited" : "☆ Favorite";
    if (favoriteIds.includes(recipe.id)) favBtn.classList.add("favorited");
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(favBtn);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    recipesListEl.appendChild(card);
  });
}

// -------------------- Dietary Filters --------------------
dietaryCheckboxes.forEach(box => {
  box.addEventListener("change", () => {
    dietaryFilters = Array.from(dietaryCheckboxes)
      .filter(b => b.checked)
      .map(b => b.value);
    renderRecipes();
  });
});

clearFiltersBtn.addEventListener("click", () => {
  dietaryCheckboxes.forEach(b => (b.checked = false));
  dietaryFilters = [];
  renderRecipes();
});

// -------------------- Detail View --------------------
function showRecipeDetail(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  recipeDetailSection.style.display = "block";
  document.querySelectorAll(".tab-section").forEach(sec => sec.style.display = "none");

  detailTitleEl.textContent = recipe.name;
  detailIngredientsEl.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    detailIngredientsEl.appendChild(li);
  });

  detailStepsEl.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    detailStepsEl.appendChild(li);
  });

  detailMetaEl.textContent = `Tags: ${recipe.tags.join(", ")}`;

  if (!userHistory.viewed.includes(id)) userHistory.viewed.push(id);
  saveState();
  renderRecommendations();
}

document.getElementById("back-to-list").addEventListener("click", () => {
  recipeDetailSection.style.display = "none";
  document.querySelector("#tab-all").style.display = "block";
  renderRecipes();
  renderFavorites();
  renderRecommendations();
});

// -------------------- Recommendations --------------------
function getRecommendations() {
  const interactedIds = [...new Set([...userHistory.viewed, ...favoriteIds])];
  const recs = recipes.filter(r => !interactedIds.includes(r.id));
  return recs.slice(0, 5);
}

function renderRecommendations() {
  recommendationsListEl.innerHTML = "";
  const recs = getRecommendations();
  if (recs.length === 0) {
    recommendationsListEl.innerHTML = "<p class='muted'>No recommendations yet. Interact with some recipes!</p>";
    return;
  }

  recs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(title);
    card.appendChild(desc);

    recommendationsListEl.appendChild(card);
  });
}

// -------------------- Weekly Meal Plan --------------------
function generateWeeklyPlan() {
  weeklyPlanEl.innerHTML = "";
  const days = parseInt(planDaysEl.value);
  if (favoriteIds.length < days) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  }
  weeklyPlanEmptyEl.style.display = "none";

  // Shuffle favorites
  const shuffled = [...favoriteIds].sort(() => 0.5 - Math.random());
  const plan = shuffled.slice(0, days);

  plan.forEach((id, i) => {
    const recipe = recipes.find(r => r.id === id);
    const card = document.createElement("div");
    card.className = "plan-card";

    const title = document.createElement("h4");
    title.textContent = `Day ${i + 1}: ${recipe.name}`;
    card.appendChild(title);

    const ingredients = document.createElement("p");
    ingredients.textContent = `Ingredients: ${recipe.ingredients.join(", ")}`;
    card.appendChild(ingredients);

    weeklyPlanEl.appendChild(card);
  });
}

generatePlanBtn.addEventListener("click", generateWeeklyPlan);

// -------------------- Initial Render --------------------
renderRecipes();
renderFavorites();
renderRecommendations();
