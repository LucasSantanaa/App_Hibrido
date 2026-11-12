import { useCallback, useEffect, useState } from 'react';
import { fetchRecipes } from '../data/recipesApi';
import { products } from '../data/mockData';

function getOfflineRecipes(query, category) {
  const normalizedQuery = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      `${product.name} ${product.restaurant}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      !category || product.categoryName?.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory;
  });
}

export default function useRecipeList({ query = '', category = '' } = {}) {
  const [recipes, setRecipes] = useState(() => getOfflineRecipes(query, category));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRecipes(await fetchRecipes({ query, category }));
    } catch (requestError) {
      setRecipes(getOfflineRecipes(query, category));
      setError(
        `${requestError.message} Exibindo o cardápio local enquanto a conexão não retorna.`
      );
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { recipes, loading, error, reload };
}
