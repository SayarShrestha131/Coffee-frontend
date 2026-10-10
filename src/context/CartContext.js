import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { apiRequest } from '../api/client';
import { PROMO_CODES } from '../data/mockData';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const EMPTY_CART = { items: [], appliedPromo: null, deliveryType: 'delivery' };
const toServerItem = (item) => ({
  productId: item.product.id,
  sizeId: item.size?.id,
  ice: item.ice,
  sweetness: item.sweetness,
  milkId: item.milk?.id || null,
  toppingIds: (item.toppings || []).map((topping) => topping.id),
  quantity: item.quantity,
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user, updateUserSnapshot } = useAuth();
  const sessionRef = useRef({ userId: user.id, isAuthenticated });
  const [cartItems, setCartItems] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryTypeState] = useState('delivery');
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const itemsRef = useRef([]);
  const promoRef = useRef(null);
  const deliveryRef = useRef('delivery');
  const writeQueue = useRef(Promise.resolve());
  const writeVersion = useRef(0);

  useEffect(() => {
    sessionRef.current = { userId: user.id, isAuthenticated };
  }, [user.id, isAuthenticated]);

  const setCart = useCallback((cart) => {
    itemsRef.current = cart.items || [];
    promoRef.current = cart.appliedPromo || null;
    deliveryRef.current = cart.deliveryType || 'delivery';
    setCartItems(itemsRef.current);
    setAppliedPromo(promoRef.current);
    setDeliveryTypeState(deliveryRef.current);
  }, []);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return undefined;

    Promise.all([apiRequest('/cart'), apiRequest('/orders')])
      .then(([cart, orders]) => {
        if (!active) return;
        setCart(cart);
        setOrderHistory(orders.orders.map((order) => ({
          ...order,
          date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        })));
      })
      .catch((error) => {
        if (active) {
          setCart(EMPTY_CART);
          setOrderHistory([]);
          Alert.alert('Could not sync your account', error.message);
        }
      })
      .finally(() => {
        if (active) setLoadedUserId(user.id);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, user.id, setCart]);

  const persistCart = useCallback((items, promo, type) => {
    const version = ++writeVersion.current;
    const ownerId = user.id;
    const body = {
      items: items.map(toServerItem),
      promoCode: promo?.code || null,
      deliveryType: type,
    };
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => {
        if (!sessionRef.current.isAuthenticated || sessionRef.current.userId !== ownerId) return null;
        return apiRequest('/cart', { method: 'PUT', body });
      })
      .then((cart) => {
        if (cart && version === writeVersion.current &&
          sessionRef.current.isAuthenticated && sessionRef.current.userId === ownerId) {
          setCart(cart);
        }
      })
      .catch((error) => {
        if (sessionRef.current.isAuthenticated && sessionRef.current.userId === ownerId) {
          Alert.alert('Cart was not saved', error.message);
        }
      });
  }, [setCart, user.id]);

  const replaceItems = (items) => {
    itemsRef.current = items;
    setCartItems(items);
    persistCart(items, promoRef.current, deliveryRef.current);
  };

  const addToCart = (product, customization, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      Alert.alert('Invalid quantity', 'Choose between 1 and 99 items.');
      return;
    }
    const itemKey = [
      product.id,
      customization.size?.id || 'std',
      customization.ice || '',
      customization.sweetness || '',
      customization.milk?.id || '',
      (customization.toppings || []).map((topping) => topping.id).sort().join('_'),
    ].join('-');
    const current = itemsRef.current;
    const existing = current.find((item) => item.itemKey === itemKey);
    if (existing && existing.quantity + quantity > 99) {
      Alert.alert('Quantity limit reached', 'You can add up to 99 of the same customized item.');
      return;
    }
    const next = existing
      ? current.map((item) => item.itemKey === itemKey ? { ...item, quantity: item.quantity + quantity } : item)
      : [...current, {
        id: itemKey,
        itemKey,
        product,
        size: customization.size,
        ice: customization.ice,
        sweetness: customization.sweetness,
        milk: customization.milk || null,
        toppings: customization.toppings || [],
        unitPrice: Number((product.price + (customization.size?.extraPrice || 0) +
          (customization.milk?.extraPrice || 0) +
          (customization.toppings || []).reduce((sum, topping) => sum + (topping.price || 0), 0)).toFixed(2)),
        quantity,
      }];
    replaceItems(next);
  };

  const updateQuantity = (itemId, delta) => {
    const currentItem = itemsRef.current.find((item) => item.id === itemId);
    if (currentItem && delta > 0 && currentItem.quantity + delta > 99) {
      Alert.alert('Quantity limit reached', 'You can add up to 99 of the same customized item.');
      return;
    }
    replaceItems(itemsRef.current
      .map((item) => item.id === itemId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (itemId) => replaceItems(itemsRef.current.filter((item) => item.id !== itemId));
  const clearCart = () => replaceItems([]);

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (!PROMO_CODES[clean]) return { success: false, message: 'Invalid promo code. Try COFFEE20' };
    const promo = { code: clean, ...PROMO_CODES[clean] };
    promoRef.current = promo;
    setAppliedPromo(promo);
    persistCart(itemsRef.current, promo, deliveryRef.current);
    return { success: true, message: `Promo code ${clean} applied!` };
  };

  const removePromo = () => {
    promoRef.current = null;
    setAppliedPromo(null);
    persistCart(itemsRef.current, null, deliveryRef.current);
  };

  const setDeliveryType = (type) => {
    deliveryRef.current = type;
    setDeliveryTypeState(type);
    persistCart(itemsRef.current, promoRef.current, type);
  };

  const { subtotal, discount, deliveryFee, serviceTax, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const disc = appliedPromo?.discountPercent
      ? sub * appliedPromo.discountPercent / 100
      : appliedPromo?.discountFlat ? Math.min(sub, appliedPromo.discountFlat) : 0;
    const delFee = deliveryType === 'pickup' || sub > 25 || sub === 0 ? 0 : 2;
    const tax = sub > 0 ? sub * 0.08 : 0;
    return {
      subtotal: Number(sub.toFixed(2)),
      discount: Number(disc.toFixed(2)),
      deliveryFee: Number(delFee.toFixed(2)),
      serviceTax: Number(tax.toFixed(2)),
      total: Number(Math.max(0, sub - disc + delFee + tax).toFixed(2)),
    };
  }, [cartItems, appliedPromo, deliveryType]);

  const totalItemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const placeOrder = async (orderOptions = {}) => {
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: {
        address: orderOptions.address,
        paymentMethod: orderOptions.paymentMethod,
        note: orderOptions.note,
        tip: orderOptions.tip,
      },
    });
    if (response.user) await updateUserSnapshot(response.user);
    const order = {
      ...response.order,
      date: new Date(response.order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setLastPlacedOrder(order);
    setOrderHistory((history) => [order, ...history]);
    promoRef.current = null;
    setAppliedPromo(null);
    replaceItems([]);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromo,
        removePromo,
        subtotal,
        discount,
        deliveryFee,
        serviceTax,
        total,
        deliveryType,
        setDeliveryType,
        placeOrder,
        lastPlacedOrder,
        orderHistory,
        isReady: !isAuthenticated || loadedUserId === user.id,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
