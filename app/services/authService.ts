import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { executeSql } from "./apiClient";

// Interface for user data
export interface User {
  id: number;
  email: string;
  name?: string;
  created_at: Date;
}

// Interface for authentication response
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Hash a password using SHA-256
const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hashedPassword;
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  try {
    // Check if user already exists
    const checkUserResult = await executeSql<{ rows: any[] }>(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!checkUserResult.success) {
      return {
        success: false,
        message: checkUserResult.message || "Failed to check existing user",
      };
    }

    if ((checkUserResult.data?.rows?.length ?? 0) > 0) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Get current timestamp
    const now = new Date().toISOString();

    // Insert the new user
    const insertResult = await executeSql<{ rows: User[] }>(
      "INSERT INTO users (email, password, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, created_at",
      [email.toLowerCase(), hashedPassword, name || null, now, now]
    );

    if (!insertResult.success || !insertResult.data?.rows?.[0]) {
      return {
        success: false,
        message: insertResult.message || "Failed to create user",
      };
    }

    const user = insertResult.data.rows[0];

    // Generate a simple token (in a real app, use JWT)
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${user.id}-${Date.now()}`
    );

    // Store the token in secure storage
    await SecureStore.setItemAsync("auth_token", token);
    await SecureStore.setItemAsync("user_id", user.id.toString());

    return {
      success: true,
      message: "User registered successfully",
      user,
      token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
};

// Login a user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Find the user
    const result = await executeSql<{ rows: any[] }>(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!result.success || !result.data?.rows?.length) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const user = result.data.rows[0];

    // Hash the provided password and compare
    const hashedPassword = await hashPassword(password);

    if (hashedPassword !== user.password) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Generate a token
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${user.id}-${Date.now()}`
    );

    // Store the token in secure storage
    await SecureStore.setItemAsync("auth_token", token);
    await SecureStore.setItemAsync("user_id", user.id.toString());

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: "Login successful",
      user: userWithoutPassword as User,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
};

// Logout a user
export const logoutUser = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("user_id");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Check if a user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync("auth_token");
    return !!token;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

// Get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userId = await SecureStore.getItemAsync("user_id");

    if (!userId) {
      return null;
    }

    const result = await executeSql<{ rows: User[] }>(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (!result.success || !result.data?.rows?.length) {
      return null;
    }

    return result.data.rows[0];
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};
