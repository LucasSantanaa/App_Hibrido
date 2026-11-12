import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { products } from '../data/mockData';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { fetchRecipe } from '../data/recipesApi';
import colors from '../theme/colors';

export default function DetailsScreen({ productId }) {
  const router = useRouter();
  const fallback = products.find((item) => item.id === String(productId));
  const [product, setProduct] = useState(fallback || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(String(productId));

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchRecipe(productId)
      .then((recipe) => {
        if (active) {
          setProduct(recipe);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(`${requestError.message} ${fallback ? 'Exibindo os dados locais.' : ''}`);
          setProduct(fallback || null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fallback, productId]);

  function handleAdd() {
    if (!product) return;
    addToCart(product, quantity);
    router.push('/(app)/(tabs)/cart');
  }

  if (!product && (loading || error)) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.topBar}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.name}>{loading ? 'Carregando receita...' : 'Receita não encontrada'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.iconBox}>
            <Ionicons name={product.icon} size={80} color={colors.primary} />
          </View>
        )}

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.restaurant}>{product.restaurant}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color={colors.star} />
          <Text style={styles.metaText}>{product.rating}</Text>
          <Ionicons
            name="time-outline"
            size={16}
            color={colors.textLight}
            style={{ marginLeft: 14 }}
          />
          <Text style={styles.metaText}>{product.time}</Text>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        {product.ingredients?.length ? (
          <View style={styles.ingredients}>
            <Text style={styles.ingredientsTitle}>Ingredientes</Text>
            {product.ingredients.map((ingredient) => (
              <Text key={ingredient} style={styles.ingredient}>
                • {ingredient}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Quantidade</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {(product.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 22,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  restaurant: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  metaText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 16,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 8, textAlign: 'center' },
  ingredients: { alignSelf: 'stretch', marginTop: 22 },
  ingredientsTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  ingredient: { color: colors.textLight, fontSize: 13, lineHeight: 20 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 28,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 14,
  },
});
