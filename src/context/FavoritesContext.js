import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { apiRequest } from '../api/client';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const sessionRef = useRef({ userId: user.id, isAuthenticated });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const idsRef = useRef([]);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    sessionRef.current = { userId: user.id, isAuthenticated };
  }, [user.id, isAuthenticated]);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return undefined;
    apiRequest('/favorites')
      .then(({ productIds }) => {
        if (active) {
          idsRef.current = productIds;
          setFavoriteIds(productIds);
        }
      })
      .catch((error) => {
        if (active) {
          idsRef.current = [];
          setFavoriteIds([]);
          Alert.alert('Could not load saved drinks', error.message);
        }
      })
      .finally(() => {
        if (active) setLoadedUserId(user.id);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated, user.id]);

  const toggleFavorite = (productId) => {
    const next = idsRef.current.includes(productId)
      ? idsRef.current.filter((id) => id !== productId)
      : [...idsRef.current, productId];
    idsRef.current = next;
    setFavoriteIds(next);
    const ownerId = user.id;
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => {
        if (!sessionRef.current.isAuthenticated || sessionRef.current.userId !== ownerId) return null;
        return apiRequest('/favorites', { method: 'PUT', body: { productIds: next } });
      })
      .catch((error) => {
        if (sessionRef.current.isAuthenticated && sessionRef.current.userId === ownerId) {
          Alert.alert('Favorites were not saved', error.message);
        }
      });
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, isReady: !isAuthenticated || loadedUserId === user.id }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
