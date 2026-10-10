import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function DrinkDetailScreen({ product, onBack, onGoToCart }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  // Customization state
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedIce, setSelectedIce] = useState(product.iceLevels[0]);
  const [selectedSweetness, setSelectedSweetness] = useState(product.sweetnessLevels[0]);
  const [selectedMilk, setSelectedMilk] = useState(product.milks[0] || null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Calculate live dynamic unit price
  const unitPrice = useMemo(() => {
    const base = product.price;
    const sizeExtra = selectedSize?.extraPrice || 0;
    const milkExtra = selectedMilk?.extraPrice || 0;
    const toppingsExtra = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return parseFloat((base + sizeExtra + milkExtra + toppingsExtra).toFixed(2));
  }, [product, selectedSize, selectedMilk, selectedToppings]);

  const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      {
        size: selectedSize,
        ice: selectedIce,
        sweetness: selectedSweetness,
        milk: selectedMilk,
        toppings: selectedToppings,
      },
      quantity
    );
    setShowAddedModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Hero Image Header */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: product.image }} style={styles.heroImage} />

            {/* Floating back button */}
            <TouchableOpacity
              style={styles.floatingButtonLeft}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>

            {/* Floating favorite button */}
            <TouchableOpacity
              style={styles.floatingButtonRight}
              onPress={() => toggleFavorite(product.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={22}
                color={favorited ? Colors.error : Colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Body Information Container */}
          <View style={styles.bodyContainer}>
            {/* Header info */}
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productRoast}>
                  {product.roast} • {product.origin}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.reviewsCount}>({product.reviewsCount})</Text>
              </View>
            </View>

            {/* Quick Specs Pills */}
            <View style={styles.specsRow}>
              <View style={styles.specPill}>
                <MaterialCommunityIcons name="fire" size={14} color={Colors.accent} />
                <Text style={styles.specText}>{product.calories} kcal</Text>
              </View>
              <View style={styles.specPill}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color={Colors.accent} />
                <Text style={styles.specText}>{product.caffeine} caffeine</Text>
              </View>
              <View style={styles.specPill}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.accent} />
                <Text style={styles.specText}>Fresh Brew</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Brew</Text>
              <Text
                style={styles.descriptionText}
                numberOfLines={showFullDesc ? undefined : 3}
              >
                {product.description}
              </Text>
              <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                <Text style={styles.readMoreText}>
                  {showFullDesc ? 'Show less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* 1. Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cup Size</Text>
                <View style={styles.optionsRow}>
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize?.id === size.id;
                    return (
                      <TouchableOpacity
                        key={size.id}
                        style={[
                          styles.sizeCard,
                          isSelected && styles.optionCardSelected,
                        ]}
                        onPress={() => setSelectedSize(size)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons
                          name="coffee-outline"
                          size={size.id === 'L' ? 24 : size.id === 'M' ? 20 : 16}
                          color={isSelected ? Colors.card : Colors.primary}
                        />
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {size.name}
                        </Text>
                        {size.extraPrice > 0 && (
                          <Text
                            style={[
                              styles.extraPriceText,
                              isSelected && styles.extraPriceTextSelected,
                            ]}
                          >
                            +${size.extraPrice.toFixed(2)}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 2. Ice Level */}
            {product.iceLevels && product.iceLevels.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Temperature & Ice</Text>
                <View style={styles.pillsWrap}>
                  {product.iceLevels.map((ice) => {
                    const isSelected = selectedIce === ice;
                    return (
                      <TouchableOpacity
                        key={ice}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => setSelectedIce(ice)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            isSelected && styles.pillTextSelected,
                          ]}
                        >
                          {ice}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 3. Sweetness Level */}
            {product.sweetnessLevels && product.sweetnessLevels.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sweetness Level</Text>
                <View style={styles.pillsWrap}>
                  {product.sweetnessLevels.map((sweet) => {
                    const isSelected = selectedSweetness === sweet;
                    return (
                      <TouchableOpacity
                        key={sweet}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => setSelectedSweetness(sweet)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            isSelected && styles.pillTextSelected,
                          ]}
                        >
                          {sweet}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 4. Milk Choice */}
            {product.milks && product.milks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Milk Choice</Text>
                <View style={styles.pillsWrap}>
                  {product.milks.map((milk) => {
                    const isSelected = selectedMilk?.id === milk.id;
                    return (
                      <TouchableOpacity
                        key={milk.id}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => setSelectedMilk(milk)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            isSelected && styles.pillTextSelected,
                          ]}
                        >
                          {milk.name} {milk.extraPrice > 0 ? `(+$${milk.extraPrice.toFixed(2)})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 5. Toppings & Add-ons */}
            {product.toppings && product.toppings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customize Extras</Text>
                <View style={styles.toppingsList}>
                  {product.toppings.map((topping) => {
                    const isChecked = selectedToppings.some((t) => t.id === topping.id);
                    return (
                      <TouchableOpacity
                        key={topping.id}
                        style={[
                          styles.toppingItem,
                          isChecked && styles.toppingItemSelected,
                        ]}
                        onPress={() => toggleTopping(topping)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={isChecked ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={isChecked ? Colors.primary : Colors.textMuted}
                        />
                        <Text style={styles.toppingName}>{topping.name}</Text>
                        <Text style={styles.toppingPrice}>
                          +${topping.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Sticky Bottom Bar */}
        <View style={styles.stickyBottomBar}>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Feather name="minus" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Feather name="plus" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.88}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>${totalPrice.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Added to Cart Modal Popup (Figma artboard 2 of row 3) */}
        <Modal
          visible={showAddedModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddedModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconCircle}>
                <MaterialCommunityIcons name="check" size={32} color={Colors.success} />
              </View>
              <Text style={styles.modalTitle}>Added to Your Cart!</Text>
              <Text style={styles.modalSub}>
                {quantity}x {product.name} ({selectedSize?.name}) is ready for checkout.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowAddedModal(false);
                  onGoToCart();
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>View Cart & Checkout</Text>
                <Feather name="shopping-bag" size={18} color={Colors.card} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setShowAddedModal(false);
                  onBack();
                }}
              >
                <Text style={styles.modalSecondaryBtnText}>Keep Exploring</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: Colors.cardSecondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingButtonLeft: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 24,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  floatingButtonRight: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 24,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  bodyContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -24,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  productName: {
    fontSize: Typography.titleLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  productRoast: {
    fontSize: Typography.bodySmall,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
    ...Shadows.small,
  },
  ratingText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsCount: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
  specsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  specText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  section: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: Typography.bodyMedium,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  readMoreText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sizeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  optionCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionLabel: {
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: Colors.card,
  },
  extraPriceText: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  extraPriceTextSelected: {
    color: Colors.accentLight,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextSelected: {
    color: Colors.card,
    fontWeight: '700',
  },
  toppingsList: {
    gap: Spacing.sm,
  },
  toppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  toppingItemSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardSecondary,
  },
  toppingName: {
    flex: 1,
    fontSize: Typography.bodyMedium,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  toppingPrice: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.large,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: BorderRadius.full,
    padding: 4,
    gap: 8,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  quantityText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  addToCartText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '800',
    color: Colors.card,
  },
  priceBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  priceBadgeText: {
    fontSize: Typography.bodySmall,
    fontWeight: '800',
    color: Colors.card,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 20, 7, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.large,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: Spacing.lg,
  },
  modalPrimaryBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  modalPrimaryBtnText: {
    fontSize: Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.card,
  },
  modalSecondaryBtn: {
    paddingVertical: 8,
  },
  modalSecondaryBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.accent,
  },
});
