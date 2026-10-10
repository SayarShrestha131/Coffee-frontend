import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import DrinkCard from '../components/DrinkCard';
import { PRODUCTS } from '../data/mockData';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

export default function FavoritesScreen({
  onSelectProduct,
  onExploreMenu,
  onOpenDrawer,
  onOpenCart,
  onOpenNotifications,
}) {
  const { favoriteIds } = useFavorites();
  const { addToCart } = useCart();

  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter((p) => favoriteIds.includes(p.id));
  }, [favoriteIds]);

  const handleQuickAdd = (product) => {
    addToCart(
      product,
      {
        size: product.sizes[0],
        ice: product.iceLevels[0],
        sweetness: product.sweetnessLevels[0],
        milk: product.milks[0] || null,
        toppings: [],
      },
      1
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Saved Favorites"
        subtitle="Wishlist"
        onOpenDrawer={onOpenDrawer}
        onPressCart={onOpenCart}
        onPressNotifications={onOpenNotifications}
      />

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-dislike-outline" size={44} color={Colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any coffee to save it here for quick re-ordering.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={onExploreMenu}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreBtnText}>Browse Drinks</Text>
            <Feather name="arrow-right" size={18} color={Colors.card} />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.countLabel}>
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
          </Text>

          <View style={styles.gridContainer}>
            {favoriteProducts.map((product) => (
              <View key={product.id} style={styles.gridColumn}>
                <DrinkCard
                  product={product}
                  onPress={() => onSelectProduct(product)}
                  onQuickAdd={() => handleQuickAdd(product)}
                  layout="grid"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  countLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.bodyMedium,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: 8,
    ...Shadows.medium,
  },
  exploreBtnText: {
    color: Colors.card,
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
  },
});
