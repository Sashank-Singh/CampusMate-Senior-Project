import Constants from "expo-constants";
import { neon } from "@neondatabase/serverless";

// Get environment variables
const DATABASE_URL =
  Constants.expoConfig?.extra?.DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://CampusMate_owner:npg_xgO48UVpqcSk@ep-dry-tooth-a5dza69l-pooler.us-east-2.aws.neon.tech/CampusMate?sslmode=require";

// Initialize the Neon SQL client
// The neon function returns a query function that we'll use with .query() method
const sql = neon(DATABASE_URL);

// Interface for query response
interface QueryResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Execute a SQL query
export async function query<T>(
  sqlText: string,
  params: any[] = []
): Promise<QueryResponse<T>> {
  try {
    console.log("Executing SQL:", sqlText, params);

    // Use the sql.query method for parameterized queries with $1, $2, etc.
    // This is the correct way to use the Neon serverless driver for conventional function calls
    const result = await sql.query(sqlText, params);

    return {
      success: true,
      data: { rows: result } as unknown as T,
    };
  } catch (error) {
    console.error("SQL execution error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Test the database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query("SELECT 1 as test");
    return result.success;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}
