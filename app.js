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
let favoriteIds = [];
let dietaryFilters = [];
let currentTab = "tab-all";

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const noResultsEl = document.getElementById("no-results");
const noRecommendationsEl = document.getElementById("no-recommendations");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");

// Dietary filters
const dietaryCheckboxes = document.querySelectorAll("#dietary-filters input[type='checkbox']");
const clearFiltersBtn = document.getElementById("clear-filters");

// -------------------- Functions --------------------

// Render recipes in a container
function renderRecipes(arr, container) {
  container.innerHTML = "";
  if (arr.length === 0) return false;

  arr.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <div class="recipe-header">
        <h3>${recipe.name}</h3>
        <button class="favorite-button ${favoriteIds.includes(recipe.id) ? 'favorited' : ''}" data-id="${recipe.id}">
          ${favoriteIds.includes(recipe.id) ? '★' : '☆'}
        </button>
      </div>
      <p>${recipe.description}</p>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("favorite-button")) {
        showDetail(recipe.id);
      }
    });

    container.appendChild(card);
  });

  return true;
}

// Show recipe detail
function showDetail(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById("detail-title").textContent = recipe.name;
  document.getElementById("detail-ingredients").innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
  document.getElementById("detail-steps").innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join("");

  document.getElementById("recipe-detail-section").style.display = "block";
  document.getElementById(currentTab).style.display = "none";
}

// Toggle favorite
function toggleFavorite(id) {
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(f => f !== id);
  } else {
    favoriteIds.push(id);
  }
  renderAll();
}

// Apply dietary filters
function filterByDietary(arr) {
  if (dietaryFilters.length === 0) return arr;
  return arr.filter(recipe => dietaryFilters.every(tag => recipe.tags.includes(tag)));
}

// Render weekly plan
function generateWeeklyPlan() {
  const favorites = recipes.filter(r => favoriteIds.includes(r.id));
  const days = parseInt(planDaysEl.value);

  weeklyPlanEl.innerHTML = "";
  if (favorites.length === 0) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  }

  weeklyPlanEmptyEl.style.display = "none";

  for (let i = 0; i < days; i++) {
    const recipe = favorites[i % favorites.length];
    const card = document.createElement("div");
    card.className = "plan-card";
    card.innerHTML = `<h4>Day ${i + 1}: ${recipe.name}</h4>`;
    weeklyPlanEl.appendChild(card);
  }
}

// Render recommendations (non-favorites)
function renderRecommendations() {
  const recommended = recipes.filter(r => !favoriteIds.includes(r.id));
  recommendationsListEl.innerHTML = "";

  if (recommended.length === 0) {
    noRecommendationsEl.style.display = "block";
  } else {
    noRecommendationsEl.style.display = "none";
    renderRecipes(recommended, recommendationsListEl);
  }
}

// Render all sections
function renderAll() {
  const filtered = filterByDietary(recipes);
  const hasRecipes = renderRecipes(filtered, recipesListEl);
  noResultsEl.style.display = hasRecipes ? "none" : "block";

  const favs = recipes.filter(r => favoriteIds.includes(r.id));
  if (favs.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    favoritesListEl.innerHTML = "";
  } else {
    favoritesEmptyMessageEl.style.display = "none";
    renderRecipes(favs, favoritesListEl);
  }

  renderRecommendations();
}

// -------------------- Event Listeners --------------------

// Tabs
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.getElementById(currentTab).style.display = "none";
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    document.getElementById(currentTab).style.display = "block";
  });
});

// Favorite button
document.addEventListener("click", e => {
  if (e.target.classList.contains("favorite-button")) {
    const id = parseInt(e.target.dataset.id);
    toggleFavorite(id);
  }
});

// Dietary filters
dietaryCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    dietaryFilters = Array.from(dietaryCheckboxes).filter(i => i.checked).map(i => i.value);
    renderAll();
  });
});

// Clear filters
clearFiltersBtn.addEventListener("click", () => {
  dietaryCheckboxes.forEach(cb => cb.checked = false);
  dietaryFilters = [];
  renderAll();
});

// Weekly plan
document.getElementById("generate-plan").addEventListener("click", generateWeeklyPlan);

// Refresh recommendations
document.getElementById("refresh-recommendations").addEventListener("click", renderAll);

// Back from detail
document.getElementById("back-to-list").addEventListener("click", () => {
  document.getElementById("recipe-detail-section").style.display = "none";
  document.getElementById(currentTab).style.display = "block";
});

// -------------------- Initial Render --------------------
renderAll();
