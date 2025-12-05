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
  },
  {
    id: 4,
    name: "Lo Mein",
    description: "Soft noodles stir-fried with veggies and soy sauce.",
    ingredients: ["noodles", "carrot", "cabbage", "soy sauce", "oil"],
    steps: [
      "Cook noodles according to package instructions.",
      "Stir-fry vegetables in oil for 5 minutes.",
      "Add noodles and soy sauce, stir to combine."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 5,
    name: "Chia Pudding",
    description: "Healthy pudding made from chia seeds and milk.",
    ingredients: ["chia seeds", "milk", "honey", "vanilla"],
    steps: [
      "Mix chia seeds with milk and sweetener.",
      "Refrigerate for at least 2 hours or overnight.",
      "Serve chilled with toppings."
    ],
    tags: ["vegan", "gluten-free"]
  },
  {
    id: 6,
    name: "Cheese Enchiladas",
    description: "Corn tortillas filled with cheese and baked in sauce.",
    ingredients: ["corn tortillas", "cheese", "enchilada sauce"],
    steps: [
      "Fill tortillas with cheese.",
      "Place in baking dish and cover with enchilada sauce.",
      "Bake at 350°F for 20 minutes."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 7,
    name: "Chicken Noodle Soup",
    description: "Comforting soup with chicken, noodles, and veggies.",
    ingredients: ["chicken", "noodles", "carrot", "celery", "broth"],
    steps: [
      "Boil chicken in broth.",
      "Add vegetables and noodles.",
      "Simmer until cooked."
    ],
    tags: ["high-protein"]
  },
  {
    id: 8,
    name: "Mediterranean Salad",
    description: "Fresh salad with greens, veggies, and olive oil.",
    ingredients: ["lettuce", "cucumber", "tomatoes", "olive oil", "lemon juice"],
    steps: [
      "Chop all vegetables.",
      "Mix with olive oil and lemon juice.",
      "Serve chilled."
    ],
    tags: ["vegan", "gluten-free"]
  }
];

// -------------------- State --------------------
let favoriteIds = [];
let userHistory = { viewed: [], favorites: [] };
let dietaryFilters = [];
let userIngredients = [];

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const noResultsEl = document.getElementById("no-results");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");

// Ingredient input (make sure you have these in index.html)
const ingredientInputEl = document.getElementById("ingredient-input");
const addIngredientBtn = document.getElementById("add-ingredient-btn");

// -------------------- Functions --------------------

// Filter recipes based on user ingredients
function filterRecipesByIngredients() {
  if (userIngredients.length === 0) {
    recipesListEl.innerHTML = '<p class="muted">Add ingredients to see matching recipes.</p>';
    return;
  }

  const matchingRecipes = recipes.filter(recipe => {
    const matchCount = recipe.ingredients.filter(ing =>
      userIngredients.includes(ing.toLowerCase())
    ).length;
    return matchCount >= Math.ceil(recipe.ingredients.length / 2); // 50% match rule
  });

  if (matchingRecipes.length === 0) {
    recipesListEl.innerHTML = '<p class="muted">No recipes match your ingredients.</p>';
    return;
  }

  recipesListEl.innerHTML = matchingRecipes.map(recipe => `
    <div class="recipe-card" data-id="${recipe.id}">
      <div class="recipe-header">
        <h3>${recipe.name}</h3>
        <button class="favorite-button ${favoriteIds.includes(recipe.id) ? 'favorited' : ''}">☆</button>
      </div>
      <p>${recipe.description}</p>
    </div>
  `).join('');

  attachRecipeCardListeners();
}

// Attach click events for recipe cards and favorite buttons
function attachRecipeCardListeners() {
  const cards = document.querySelectorAll(".recipe-card");
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-button")) {
        toggleFavorite(Number(card.dataset.id));
        e.stopPropagation();
      } else {
        showRecipeDetail(Number(card.dataset.id));
      }
    });
  });
}

// Toggle favorite
function toggleFavorite(id) {
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(fid => fid !== id);
  } else {
    favoriteIds.push(id);
  }
  filterRecipesByIngredients();
}

// Show recipe details
function showRecipeDetail(id) {
  const recipe = recipes.find(r => r.id === id);
  document.getElementById("detail-title").textContent = recipe.name;
  document.getElementById("detail-ingredients").innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
  document.getElementById("detail-steps").innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');
  document.getElementById("recipe-detail-section").style.display = "block";
  document.getElementById("tab-all").style.display = "none";
}

// -------------------- Event Listeners --------------------

// Ingredient add button
addIngredientBtn.addEventListener("click", () => {
  const val = ingredientInputEl.value.trim().toLowerCase();
  if (val && !userIngredients.includes(val)) {
    userIngredients.push(val);
    ingredientInputEl.value = "";
    filterRecipesByIngredients();
  }
});

// Tab navigation
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab-section").forEach(sec => sec.style.display = "none");
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    const tabId = tab.dataset.tab;
    document.getElementById(tabId).style.display = "block";
    tab.classList.add("active");
  });
});

// Back from detail
document.getElementById("back-to-list").addEventListener("click", () => {
  document.getElementById("recipe-detail-section").style.display = "none";
  document.getElementById("tab-all").style.display = "block";
});

// Initialize
filterRecipesByIngredients();
