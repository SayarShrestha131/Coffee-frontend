import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import CategoryPills from '../components/CategoryPills';
import PromoBanner from '../components/PromoBanner';
import DrinkCard from '../components/DrinkCard';
import { PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';

export default function HomeScreen({
  onSelectProduct,
  onOpenDrawer,
  onOpenCart,
  onOpenTracking,
  onOpenNotifications,
  onOpenLocation,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roast.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const popularProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.isPopular);
  }, [filteredProducts]);

  const recommendedProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.isFeatured && !p.isPopular);
  }, [filteredProducts]);

  const handleQuickAdd = (product) => {
    // Quick add default configuration
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
        showLocation={true}
        onOpenDrawer={onOpenDrawer}
        onPressCart={onOpenCart}
        onPressNotifications={onOpenNotifications}
        onPressLocation={onOpenLocation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingSub}>GOOD MORNING ☕</Text>
          <Text style={styles.greetingMain}>Find Your Daily Brew</Text>
        </View>

        {/* Search & Filter Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coffee, tea, pastries..."
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

          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={20} color={Colors.card} />
          </TouchableOpacity>
        </View>

        {/* Hero Promo Banner */}
        <PromoBanner onClaim={() => onSelectProduct(PRODUCTS[0])} />

        {/* Category Pills */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Popular Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Popular Coffees</Text>
            <Text style={styles.sectionSubtitle}>Handcrafted top favorites</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedCategory('all')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* 2-Column Grid for Popular Products */}
        <View style={styles.gridContainer}>
          {popularProducts.map((product) => (
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

        {/* Recommended for You Section */}
        {recommendedProducts.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
              <View>
                <Text style={styles.sectionTitle}>Artisan Recommendations</Text>
                <Text style={styles.sectionSubtitle}>Pair with fresh bakery</Text>
              </View>
            </View>

            <View style={styles.horizontalList}>
              {recommendedProducts.map((product) => (
                <DrinkCard
                  key={product.id}
                  product={product}
                  onPress={() => onSelectProduct(product)}
                  onQuickAdd={() => handleQuickAdd(product)}
                  layout="horizontal"
                />
              ))}
            </View>
          </>
        )}
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
    paddingBottom: Spacing.xl,
  },
  greetingContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  greetingSub: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1,
  },
  greetingMain: {
    fontSize: Typography.titleLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48%',
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
  },
});
