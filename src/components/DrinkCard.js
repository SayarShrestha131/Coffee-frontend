import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useFavorites } from '../context/FavoritesContext';

export default function DrinkCard({
  product,
  onPress,
  onQuickAdd,
  layout = 'grid', // 'grid' | 'horizontal'
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  if (layout === 'horizontal') {
    return (
      <TouchableOpacity
        style={styles.cardHorizontal}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <Image source={{ uri: product.image }} style={styles.imageHorizontal} />
        <View style={styles.infoHorizontal}>
          <View style={styles.topRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={Colors.star} />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(product.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={18}
                color={favorited ? Colors.error : Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {product.subtitle || product.roast}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>
              <Text style={styles.currency}>$</Text>
              {product.price.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={onQuickAdd}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={16} color={Colors.card} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.cardGrid} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.imageGrid} />
        
        {/* Rating Badge */}
        <View style={styles.ratingBadgeOverImage}>
          <Ionicons name="star" size={12} color={Colors.star} />
          <Text style={styles.ratingTextOverImage}>{product.rating}</Text>
        </View>

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={16}
            color={favorited ? Colors.error : Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentGrid}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle || product.roast}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            <Text style={styles.currency}>$</Text>
            {product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onQuickAdd}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={18} color={Colors.card} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardGrid: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  imageGrid: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadgeOverImage: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 20, 7, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 3,
  },
  ratingTextOverImage: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentGrid: {
    paddingHorizontal: 4,
    paddingTop: Spacing.sm,
    paddingBottom: 2,
  },
  title: {
    fontSize: Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: Typography.titleSmall,
    fontWeight: '800',
    color: Colors.primary,
  },
  currency: {
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    color: Colors.accent,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },

  // Horizontal Card Layout
  cardHorizontal: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  imageHorizontal: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  infoHorizontal: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
