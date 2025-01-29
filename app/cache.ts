import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo';

const createTokenCache = (): TokenCache => ({
  getToken: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  saveToken: (key, token) => SecureStore.setItemAsync(key, token)
});

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;