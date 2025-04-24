import { neon } from '@neondatabase/serverless';
import Constants from 'expo-constants';

// Get connection string from environment variables
const connectionString = 
  Constants.expoConfig?.extra?.DATABASE_URL || 
  process.env.DATABASE_URL || 
  'postgresql://CampusMate_owner:npg_xgO48UVpqcSk@ep-dry-tooth-a5dza69l-pooler.us-east-2.aws.neon.tech/CampusMate?sslmode=require';

// Initialize the neon SQL client
const sql = neon(connectionString);

// Export a simple function to execute queries
const executeQuery = async (query: string, params: any[] = []) => {
  try {
    // Use sql.query method for parameterized queries with $1, $2, etc.
    const result = await sql.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default executeQuery;
