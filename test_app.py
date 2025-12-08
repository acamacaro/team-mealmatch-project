# Simple test for shopping list logic (Activity #12)

def get_missing_ingredients(recipe_ingredients, user_ingredients):
    # Normalize user ingredients to lowercase
    user_set = {i.lower() for i in user_ingredients}
    # Return any recipe ingredient the user doesn't have
    return [i for i in recipe_ingredients if i.lower() not in user_set]

# ---- TEST DATA ----
recipe_ingredients = ["chicken", "tortillas", "cheese"]
user_ingredients = ["chicken", "tortillas"]

# We expect to be missing only "cheese"
expected = ["cheese"]

result = get_missing_ingredients(recipe_ingredients, user_ingredients)

# ---- SIMPLE ASSERTION ----
if result == expected:
    print("✅ TEST PASSED: Missing ingredient logic works correctly")
else:
    print("❌ TEST FAILED")
    print("Expected:", expected)
    print("Got:", result)
