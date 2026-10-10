import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiRequest, loadAccessToken, saveAccessToken } from '../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'cafe-bliss-user';
const EMPTY_USER = {
  name: '',
  email: '',
  phone: '',
  avatar: '',
  memberTier: 'Coffee Club Member',
  rewardPoints: 0,
  ordersCount: 0,
  savedAddress: '',
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(EMPTY_USER);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await loadAccessToken();
        const cachedUser = await SecureStore.getItemAsync(USER_KEY);
        if (token && cachedUser) {
          const response = await apiRequest('/auth/me');
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
          setUser(response.user);
          setIsAuthenticated(true);
        } else if (token || cachedUser) {
          await saveAccessToken(null);
          await SecureStore.deleteItemAsync(USER_KEY);
        }
      } catch (error) {
        if (error.status === 401) {
          await saveAccessToken(null);
          await SecureStore.deleteItemAsync(USER_KEY);
        } else {
          try {
            const cachedUser = await SecureStore.getItemAsync(USER_KEY);
            if (cachedUser) {
              setUser(JSON.parse(cachedUser));
              setIsAuthenticated(true);
            }
          } catch (restoreError) {
            console.error('Unable to restore saved sign-in:', restoreError);
            Alert.alert('Sign-in unavailable', 'Your saved sign-in could not be read. Please sign in again.');
            await saveAccessToken(null);
            await SecureStore.deleteItemAsync(USER_KEY);
          }
        }
      } finally {
        setIsReady(true);
      }
    };
    restoreSession();
  }, []);

  const saveSession = async (session, persist = true) => {
    await saveAccessToken(session.token, persist);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user));
    setUser(session.user);
    setIsAuthenticated(true);
  };

  const login = async (email, password, rememberMe = true) => {
    const session = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await saveSession(session, rememberMe);
    return session.user;
  };

  const signup = async (name, email, phone, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, phone, password },
    });
    setPendingVerificationEmail(response.email);
    return response;
  };

  const verifyOtp = async (code) => {
    if (!pendingVerificationEmail) throw new Error('Start account registration before verifying your email.');
    const session = await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: { email: pendingVerificationEmail, code },
    });
    await saveSession(session);
    setPendingVerificationEmail(null);
    return session.user;
  };

  const resendVerificationCode = async () => {
    if (!pendingVerificationEmail) throw new Error('No pending email verification.');
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: { email: pendingVerificationEmail },
    });
  };

  const requestPasswordReset = async (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });

  const resetPassword = async (email, code, password) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: { email, code, password },
  });

  const logout = async () => {
    await saveAccessToken(null);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(EMPTY_USER);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updatedFields) => {
    const response = await apiRequest('/auth/me', {
      method: 'PATCH',
      body: updatedFields,
    });
    setUser(response.user);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
    return response.user;
  };

  const updateUserSnapshot = async (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Unable to update saved profile data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isReady,
        user,
        login,
        signup,
        verifyOtp,
        resendVerificationCode,
        requestPasswordReset,
        resetPassword,
        logout,
        updateProfile,
        updateUserSnapshot,
        pendingVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
