import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FoodCard from '../components/FoodCard';
import { ActionButton, Notice, Screen } from '../components/Screen';
import { useFavorites } from '../context/FavoritesContext';
import useRecipeList from '../hooks/useRecipeList';
import colors from '../theme/colors';

export function SearchScreen() {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const { recipes, loading, error } = useRecipeList({ query });
  const router = useRouter();

  return (
    <Screen title="Buscar receitas" subtitle="Encontre seu próximo prato" showBack>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.textLight} />
        <TextInput
          accessibilityLabel="Buscar receitas"
          autoCapitalize="none"
          onChangeText={setDraft}
          onSubmitEditing={() => setQuery(draft.trim())}
          placeholder="Ex.: macarrão, frango..."
          returnKeyType="search"
          style={styles.searchInput}
          value={draft}
        />
      </View>
      <ActionButton label="Buscar" onPress={() => setQuery(draft.trim())} />
      <Notice message={error} />
      {loading ? <Text style={styles.stateText}>Consultando a API de receitas...</Text> : null}
      {!loading && !recipes.length ? (
        <Text style={styles.stateText}>Nenhuma receita encontrada. Tente outro termo.</Text>
      ) : null}
      {recipes.map((recipe) => (
        <FoodCard
          key={recipe.id}
          product={recipe}
          onPress={() => router.push(`/details/${recipe.id}`)}
        />
      ))}
    </Screen>
  );
}

export function CategoriesScreen() {
  const { recipes, error, loading } = useRecipeList();
  const router = useRouter();
  const categories = useMemo(
    () => [...new Set(recipes.flatMap((recipe) => recipe.tags || [recipe.categoryName]).filter(Boolean))],
    [recipes]
  );

  return (
    <Screen title="Categorias" subtitle="Explore receitas por tipo" showBack>
      <Notice message={error} />
      {loading ? <Text style={styles.stateText}>Carregando categorias...</Text> : null}
      <View style={styles.categoryGrid}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category}
            onPress={() => router.push(`/category/${encodeURIComponent(category)}`)}
            style={styles.categoryCard}
          >
            <View style={[styles.categoryIcon, { backgroundColor: categoryColors[index % categoryColors.length] }]}>
              <Ionicons name={categoryIcons[index % categoryIcons.length]} size={24} color={colors.primaryDark} />
            </View>
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryCount}>
              {recipes.filter((recipe) => (recipe.tags || [recipe.categoryName]).includes(category)).length} receitas
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

export function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const category = String(name || '');
  const { recipes, loading, error } = useRecipeList({ category });
  const router = useRouter();

  return (
    <Screen title={category || 'Categoria'} subtitle="Receitas disponíveis" showBack>
      <Notice message={error} />
      {loading ? <Text style={styles.stateText}>Carregando receitas...</Text> : null}
      {!loading && !recipes.length ? (
        <Text style={styles.stateText}>Não há receitas para esta categoria.</Text>
      ) : null}
      {recipes.map((recipe) => (
        <FoodCard
          key={recipe.id}
          product={recipe}
          onPress={() => router.push(`/details/${recipe.id}`)}
        />
      ))}
    </Screen>
  );
}

export function FavoritesScreen() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  const { recipes, loading, error } = useRecipeList();
  const router = useRouter();
  const favorites = recipes.filter((recipe) => favoriteIds.includes(String(recipe.id)));

  return (
    <Screen title="Favoritos" subtitle="Receitas que você guardou" showBack>
      <Notice message={error} />
      {favoritesLoading || loading ? <Text style={styles.stateText}>Carregando favoritos...</Text> : null}
      {!favoritesLoading && !loading && !favoriteIds.length ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={46} color={colors.primary} />
          <Text style={styles.stateText}>Você ainda não salvou receitas.</Text>
          <ActionButton label="Explorar receitas" onPress={() => router.replace('/(app)/(tabs)')} />
        </View>
      ) : null}
      {!loading && favoriteIds.length > 0 && !favorites.length ? (
        <Text style={styles.stateText}>Favoritos indisponíveis no cardápio offline. Conecte-se para carregá-los.</Text>
      ) : null}
      {favorites.map((recipe) => (
        <FoodCard
          key={recipe.id}
          product={recipe}
          onPress={() => router.push(`/details/${recipe.id}`)}
        />
      ))}
    </Screen>
  );
}

const categoryColors = ['#FFF0E8', '#EAF8F6', '#F3EDFF', '#FFF7E0'];
const categoryIcons = ['restaurant-outline', 'leaf-outline', 'cafe-outline', 'fast-food-outline'];

const styles = StyleSheet.create({
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  searchInput: { color: colors.text, flex: 1, height: 50 },
  stateText: { color: colors.textLight, fontSize: 14, lineHeight: 20, marginVertical: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 132,
    padding: 14,
  },
  categoryIcon: { alignItems: 'center', borderRadius: 14, height: 46, justifyContent: 'center', width: 46 },
  categoryName: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 12 },
  categoryCount: { color: colors.textLight, fontSize: 12, marginTop: 4 },
  emptyState: { alignItems: 'center', gap: 12, paddingVertical: 34 },
});
