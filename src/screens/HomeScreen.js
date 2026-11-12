import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodCard from '../components/FoodCard';
import useRecipeList from '../hooks/useRecipeList';
import colors from '../theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('');
  const { recipes, error, loading } = useRecipeList();
  const tags = useMemo(
    () => [...new Set(recipes.flatMap((recipe) => recipe.tags || [recipe.categoryName]).filter(Boolean))].slice(0, 8),
    [recipes]
  );
  const filteredProducts = activeCategory
    ? recipes.filter((recipe) =>
        (recipe.tags || [recipe.categoryName]).some(
          (tag) => tag?.toLowerCase() === activeCategory.toLowerCase()
        )
      )
    : recipes;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Seu próximo prato favorito</Text>
          <Text style={styles.headerTitle}>O que vamos pedir hoje?</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Abrir favoritos"
          onPress={() => router.push('/favorites')}
          style={styles.favoritesButton}
        >
          <Ionicons name="heart-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/search')}
        style={styles.searchBar}
      >
        <Ionicons name="search-outline" size={18} color={colors.textLight} />
        <Text style={styles.searchPlaceholder}>Buscar receitas...</Text>
      </Pressable>

      <View style={styles.quickLinks}>
        <TouchableOpacity onPress={() => router.push('/categories')} style={styles.quickLink}>
          <Ionicons name="grid-outline" size={17} color={colors.primary} />
          <Text style={styles.quickLinkText}>Categorias</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/orders')} style={styles.quickLink}>
          <Ionicons name="receipt-outline" size={17} color={colors.primary} />
          <Text style={styles.quickLinkText}>Meus pedidos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={['', ...tags]}
        keyExtractor={(item) => item || 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => {
          const active = item === activeCategory;
          return (
            <TouchableOpacity
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => setActiveCategory(item)}
            >
              <Ionicons
                name={item ? 'restaurant-outline' : 'grid-outline'}
                size={16}
                color={active ? colors.background : colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {item || 'Todos'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.loading}>Carregando receitas da API...</Text> : null}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodCard
            product={item}
            onPress={() => router.push(`/details/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma receita encontrada nesta categoria.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  favoritesButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 18,
  },
  searchPlaceholder: { color: colors.textLight, flex: 1, fontSize: 14 },
  quickLinks: { flexDirection: 'row', gap: 10, marginTop: 14 },
  quickLink: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 11,
  },
  quickLinkText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  categoryList: {
    gap: 10,
    paddingVertical: 18,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.background,
  },
  list: {
    paddingBottom: 24,
  },
  error: { color: colors.danger, fontSize: 12, lineHeight: 17, marginBottom: 8 },
  loading: { color: colors.textLight, fontSize: 12, marginBottom: 8 },
  empty: { alignItems: 'center', padding: 28 },
  emptyText: { color: colors.textLight, fontSize: 14, textAlign: 'center' },
});
