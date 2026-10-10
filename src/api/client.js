import * as SecureStore from 'expo-secure-store';

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'cafe-bliss-auth-token';

let accessToken = null;

export const loadAccessToken = async () => {
  accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return accessToken;
};

export const saveAccessToken = async (token, persist = true) => {
  accessToken = token;
  if (token && persist) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const apiRequest = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
      ...(options.body && typeof options.body !== 'string'
        ? { body: JSON.stringify(options.body) }
        : {}),
    });
  } catch {
    throw new Error(`Cannot connect to the Café Bliss API at ${API_URL}. Check that the backend is running and the device can reach it.`);
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
};

export const getApiUrl = () => API_URL;
