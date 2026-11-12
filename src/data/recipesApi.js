const API_URL = 'https://dummyjson.com/recipes';

function mapRecipe(recipe) {
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(' ')
    : recipe.instructions || '';
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];

  return {
    id: String(recipe.id),
    name: recipe.name,
    restaurant: recipe.cuisine || 'Cozinha SaborExpress',
    description: instructions,
    price: 18 + (Number(recipe.id) % 6) * 4,
    rating: Number(recipe.rating) || 0,
    time: `${(Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0)} min`,
    icon: 'restaurant',
    image: recipe.image || '',
    category: tags[0] || 'Receitas',
    tags,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    difficulty: recipe.difficulty || 'Intermediária',
    servings: Number(recipe.servings) || 1,
  };
}

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`A API de receitas respondeu com status ${response.status}.`);
  }
  return response.json();
}

export async function fetchRecipes({ query = '', category = '' } = {}) {
  let result;
  if (query.trim()) {
    result = await request(`/search?q=${encodeURIComponent(query.trim())}`);
  } else if (category) {
    result = await request(`/tag/${encodeURIComponent(category)}`);
  } else {
    result = await request('?limit=50');
  }
  return (result.recipes || []).map(mapRecipe);
}

export async function fetchRecipe(id) {
  const recipe = await request(`/${encodeURIComponent(id)}`);
  return mapRecipe(recipe);
}
