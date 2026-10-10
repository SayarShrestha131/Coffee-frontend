import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import CategoryPills from '../components/CategoryPills';
import DrinkCard from '../components/DrinkCard';
import { PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';

export default function DrinksMenuScreen({
  onSelectProduct,
  onOpenDrawer,
  onOpenCart,
  onOpenNotifications,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price_low' | 'rating'
  const { addToCart } = useCart();

  const sortedAndFiltered = useMemo(() => {
    let list = PRODUCTS.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roast.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

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
        title="Drink Catalog"
        subtitle="Explore Menu"
        onOpenDrawer={onOpenDrawer}
        onPressCart={onOpenCart}
        onPressNotifications={onOpenNotifications}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search our roasts, iced blends, teas..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Bar */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sort Chips Row */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>SORT BY:</Text>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'popular' && styles.sortChipActive]}
            onPress={() => setSortBy('popular')}
          >
            <Text
              style={[styles.sortChipText, sortBy === 'popular' && styles.sortChipTextActive]}
            >
              Popular
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'price_low' && styles.sortChipActive]}
            onPress={() => setSortBy('price_low')}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === 'price_low' && styles.sortChipTextActive,
              ]}
            >
              Price $
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text
              style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}
            >
              ⭐ Top Rated
            </Text>
          </TouchableOpacity>
        </View>

        {/* List of Drinks */}
        <View style={styles.listContainer}>
          {sortedAndFiltered.map((product) => (
            <DrinkCard
              key={product.id}
              product={product}
              onPress={() => onSelectProduct(product)}
              onQuickAdd={() => handleQuickAdd(product)}
              layout="horizontal"
            />
          ))}

          {sortedAndFiltered.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="cafe-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No coffees found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or category selection.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sortLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardSecondary,
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
  },
  sortChipText: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sortChipTextActive: {
    color: Colors.card,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
