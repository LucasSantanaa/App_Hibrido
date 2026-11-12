import React, { createContext, useContext } from 'react';
import usePersistentValue from '../hooks/usePersistentValue';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds, loading, storageError] = usePersistentValue(
    'sabor-express:favorites',
    []
  );

  function toggleFavorite(productId) {
    setFavoriteIds((current) =>
      current.includes(String(productId))
        ? current.filter((id) => id !== String(productId))
        : [...current, String(productId)]
    );
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, toggleFavorite, loading, storageError }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites precisa ser usado dentro de um FavoritesProvider');
  }
  return context;
}
