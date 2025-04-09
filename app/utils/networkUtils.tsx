import NetInfo from '@react-native-community/netinfo';

// Check if device is connected to the internet via NetInfo
export const isNetworkConnected = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    
    // If NetInfo says we're not connected, trust that
    if (!state.isConnected) {
      return false;
    }
    
    // If NetInfo is uncertain about internet reachability, do our own check
    if (state.isInternetReachable === null || state.isInternetReachable === false) {
      return await checkActualConnectivity();
    }
    
    return true;
  } catch (error) {
    console.log('NetInfo check failed:', error);
    // Fallback to our manual connectivity check
    return await checkActualConnectivity();
  }
};

// Check multiple endpoints to verify true internet connectivity
const checkActualConnectivity = async (): Promise<boolean> => {
  // First, try our Neon DB connection test
  try {
    // Import dynamically if necessary or directly if no circular dependency
    const { testConnection } = await import('../lib/db'); // Assuming db.ts is in lib
    const neonConnected = await testConnection();
    if (neonConnected) {
      return true;
    }
  } catch (error) {
    console.log('Neon DB connectivity check failed:', error);
  }
  
  // If Neon check fails, try other reliable endpoints
  const endpoints = [
    'https://cloudflare.com',
    'https://1.1.1.1',
    'https://www.google.com'
  ];
  
  try {
    // Try each endpoint with a quick timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Try to connect to any endpoint
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          clearTimeout(timeoutId);
          return true;
        }
      } catch (e) {
        // Continue to next endpoint if one fails
        continue;
      }
    }
    
    clearTimeout(timeoutId);
    return false;
  } catch (error) {
    console.log('Connectivity check failed:', error);
    return false;
  }
};

// Check current network status by trying to fetch a known endpoint
export const checkNetworkStatus = async () => {
  return await isNetworkConnected();
};

// Fetch with timeout
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000
) => {
  // First check network connectivity
  const isConnected = await isNetworkConnected();
  if (!isConnected) {
    throw new Error('No network connection available');
  }
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache'
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Retry fetch with exponential backoff
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = 300
) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      lastError = error;
      // Only wait if we're going to retry again
      if (i < retries - 1) {
        // Exponential backoff
        const waitTime = backoff * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError;
}; 