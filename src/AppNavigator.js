import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Colors } from './theme';
import { useAuth } from './context/AuthContext';

// Components
import BottomTabBar from './components/BottomTabBar';
import DrawerMenu from './components/DrawerMenu';

// Screens
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import OtpModal from './screens/OtpModal';
import HomeScreen from './screens/HomeScreen';
import DrinksMenuScreen from './screens/DrinksMenuScreen';
import DrinkDetailScreen from './screens/DrinkDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderSuccessModal from './screens/OrderSuccessModal';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useCart } from './context/CartContext';
import { useFavorites } from './context/FavoritesContext';

export default function AppNavigator() {
  const { isAuthenticated, isReady, verifyOtp, resendVerificationCode } = useAuth();
  const { isReady: isCartReady } = useCart();
  const { isReady: areFavoritesReady } = useFavorites();

  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('Splash'); // 'Splash' | 'Auth' | 'Main'
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Menu' | 'Favorites' | 'Cart' | 'Profile'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  
  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [developmentVerificationCode, setDevelopmentVerificationCode] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Auth flow triggers
  const handleGetStarted = () => {
    setCurrentScreen('Auth');
  };

  const handleTriggerOtp = (email, verificationCode = null) => {
    setOtpEmail(email);
    setDevelopmentVerificationCode(verificationCode);
    setIsOtpOpen(true);
  };

  const handleVerifyOtp = async (code) => {
    await verifyOtp(code);
    setIsOtpOpen(false);
    setCurrentScreen('Main');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutActive(true);
  };

  const handleOrderSuccess = (order) => {
    setPlacedOrder(order);
    setIsCheckoutActive(false);
    setIsSuccessModalOpen(true);
  };

  const handleTrackOrderFromSuccess = () => {
    setIsSuccessModalOpen(false);
    setIsTrackingActive(true);
  };

  const handleDrawerNavigate = (screenId) => {
    if (screenId === 'Tracking') {
      setIsTrackingActive(true);
      return;
    }
    setIsTrackingActive(false);
    setIsCheckoutActive(false);
    setSelectedProduct(null);
    setActiveTab(screenId);
  };

  // Render Authentication / Splash flow if not authenticated
  if (!isReady) return null;
  if (isAuthenticated && (!isCartReady || !areFavoritesReady)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated && currentScreen !== 'Auth') {
    return (
      <SplashScreen
        onGetStarted={handleGetStarted}
        onSignIn={() => setCurrentScreen('Auth')}
      />
    );
  }

  if (!isAuthenticated && currentScreen === 'Auth') {
    return (
      <>
        <AuthScreen
          initialMode="login"
          onTriggerOtp={handleTriggerOtp}
          onBackToSplash={() => setCurrentScreen('Splash')}
        />
        <OtpModal
          key={`${isOtpOpen}:${otpEmail}:${developmentVerificationCode || ''}`}
          visible={isOtpOpen}
          email={otpEmail}
          developmentCode={developmentVerificationCode}
          onVerify={handleVerifyOtp}
          onResend={resendVerificationCode}
          onClose={() => {
            setIsOtpOpen(false);
            setDevelopmentVerificationCode(null);
          }}
        />
      </>
    );
  }

  // Active Order Tracking screen
  if (isTrackingActive) {
    return (
      <OrderTrackingScreen
        onBack={() => setIsTrackingActive(false)}
        onGoHome={() => {
          setIsTrackingActive(false);
          setActiveTab('Home');
        }}
      />
    );
  }

  // Active Checkout screen
  if (isCheckoutActive) {
    return (
      <>
        <CheckoutScreen
          onBack={() => setIsCheckoutActive(false)}
          onOrderSuccess={handleOrderSuccess}
        />
        <OrderSuccessModal
          visible={isSuccessModalOpen}
          order={placedOrder}
          onTrackOrder={handleTrackOrderFromSuccess}
          onBackToHome={() => {
            setIsSuccessModalOpen(false);
            setActiveTab('Home');
          }}
        />
      </>
    );
  }

  // Active Product Customizer Detail Screen
  if (selectedProduct) {
    return (
      <DrinkDetailScreen
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onGoToCart={() => {
          setSelectedProduct(null);
          setActiveTab('Cart');
        }}
      />
    );
  }

  // Main Tab screens
  const renderTabScreen = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            onSelectProduct={handleSelectProduct}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenCart={() => setActiveTab('Cart')}
            onOpenTracking={() => setIsTrackingActive(true)}
            onOpenNotifications={() =>
              Alert.alert('Notifications', '⚡ Special: Enjoy 20% off with promo code COFFEE20 today!')
            }
            onOpenLocation={() =>
              Alert.alert('Delivery Address', 'Selected: SoHo, 452 Broadway, New York')
            }
          />
        );
      case 'Menu':
        return (
          <DrinksMenuScreen
            onSelectProduct={handleSelectProduct}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenCart={() => setActiveTab('Cart')}
            onOpenNotifications={() =>
              Alert.alert('Notifications', 'Brewing hours: 7:00 AM - 10:00 PM daily')
            }
          />
        );
      case 'Favorites':
        return (
          <FavoritesScreen
            onSelectProduct={handleSelectProduct}
            onExploreMenu={() => setActiveTab('Menu')}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenCart={() => setActiveTab('Cart')}
            onOpenNotifications={() =>
              Alert.alert('Favorites', 'Items saved for one-tap reordering.')
            }
          />
        );
      case 'Cart':
        return (
          <CartScreen
            onProceedToCheckout={handleProceedToCheckout}
            onExploreMenu={() => setActiveTab('Menu')}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenNotifications={() =>
              Alert.alert('Cart Alerts', 'Free delivery applied on orders over रू25!')
            }
          />
        );
      case 'Profile':
        return (
          <ProfileScreen
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenCart={() => setActiveTab('Cart')}
            onOpenNotifications={() =>
              Alert.alert('Rewards', 'Gold Connoisseur perk: Free milk substitutions.')
            }
            onGoToOrderTracking={() => setIsTrackingActive(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Active Tab Screen */}
      <View style={styles.screenWrapper}>{renderTabScreen()}</View>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Slide-in Navigation Drawer */}
      <DrawerMenu
        visible={isDrawerOpen}
        activeScreen={activeTab}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        visible={isSuccessModalOpen}
        order={placedOrder}
        onTrackOrder={handleTrackOrderFromSuccess}
        onBackToHome={() => {
          setIsSuccessModalOpen(false);
          setActiveTab('Home');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
