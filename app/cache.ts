import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { TokenCache } from '@clerk/types';

const createTokenCache = (): TokenCache => ({
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  saveToken: (key: string, token: string) => SecureStore.setItemAsync(key, token)
});

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
