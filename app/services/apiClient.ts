import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Get the DATABASE_URL from environment variables
const DATABASE_URL = Constants.expoConfig?.extra?.DATABASE_URL ||
                    process.env.DATABASE_URL ||
                    'postgresql://CampusMate_owner:npg_xgO48UVpqcSk@ep-dry-tooth-a5dza69l-pooler.us-east-2.aws.neon.tech/CampusMate?sslmode=require';

// Parse the DATABASE_URL to extract components
const parseDbUrl = (url: string) => {
  // Format: postgresql://username:password@hostname/database
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }

  return {
    username: match[1],
    password: match[2],
    host: match[3],
    database: match[4]
  };
};

// Extract connection details
const dbConfig = parseDbUrl(DATABASE_URL);

// Neon HTTP API endpoint
const NEON_API_URL = `https://${dbConfig.host}/sql`;

// Base64 encode credentials for Basic Auth
const BASIC_AUTH = `Basic ${btoa(`${dbConfig.username}:${dbConfig.password}`)}`;

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Function to make API requests
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  try {
    // Build request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build request options
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Execute SQL queries using Neon's HTTP API
export async function executeSql<T>(query: string, params: any[] = []): Promise<ApiResponse<T>> {
  try {
    console.log('Executing SQL:', query, params);

    // Prepare the request body
    const requestBody = {
      query,
      params
    };

    // Make the HTTP request to Neon's API
    const response = await fetch(NEON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BASIC_AUTH
      },
      body: JSON.stringify(requestBody)
    });

    // Parse the response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      return {
        success: false,
        message: 'Failed to parse database response'
      };
    }

    // Check if the request was successful
    if (!response.ok) {
      console.error('Neon API error:', responseData);
      return {
        success: false,
        message: responseData.message || responseData.error || 'Database query failed'
      };
    }

    // Handle different response formats
    let rows = [];
    if (responseData.rows) {
      // Standard query response
      rows = responseData.rows;
    } else if (Array.isArray(responseData)) {
      // Some APIs return an array directly
      rows = responseData;
    } else if (responseData.result && Array.isArray(responseData.result)) {
      // Some APIs nest results
      rows = responseData.result;
    }

    // Format the response to match the expected structure
    return {
      success: true,
      data: { rows } as unknown as T
    };
  } catch (error) {
    console.error('SQL execution error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
