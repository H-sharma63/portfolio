import { Pool, QueryResultRow } from 'pg';
import { NextResponse } from 'next/server';

// This API route handles fetching and updating dynamic content for the portfolio.
// It interacts with a PostgreSQL database to store and retrieve various sections
// of the website's content (e.g., hero, about, projects, skills, footer).

// Define the structure for a row in the 'config' table.
interface ConfigRow extends QueryResultRow {
  key: string; // The key identifying a piece of content (e.g., 'hero', 'about').
  value: unknown; // The actual content, stored as a JSON type in the database.
}

// Initialize a PostgreSQL connection pool.
// The connection string is loaded from environment variables (DATABASE_URL).
// SSL is configured to reject unauthorized connections, which is important for production.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Set to true in production if you have a valid SSL certificate
  },
});

/**
 * Handles GET requests to retrieve all dynamic content.
 * Fetches key-value pairs from the 'config' table in the database
 * and returns them as a single JSON object.
 * @returns {NextResponse} - A JSON response containing all content or an error message.
 */
export async function GET() {
  try {
    // Acquire a client from the connection pool.
    const client = await pool.connect();
    // Execute a SQL query to select all key-value pairs from the 'config' table.
    const result = await client.query<ConfigRow>('SELECT key, value FROM config');
    // Release the client back to the pool.
    client.release();

    // Transform the query results into a more accessible object format.
    const content: Record<string, any> = {};
    result.rows.forEach(row => {
      content[row.key] = row.value as any; // Assign the value to its corresponding key.
    });

    // Return the content as a JSON response.
    return NextResponse.json(content);
  } catch (error) {
    // Log the error and return an error response if content fetching fails.
    console.error('Error fetching content from database:', error);
    return NextResponse.json({ message: 'Failed to fetch content.', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * Handles POST requests to update dynamic content.
 * Receives a JSON object with updated content, iterates through it,
 * and updates or inserts each key-value pair into the 'config' table.
 * @param {Request} request - The incoming Next.js API request containing the updated content.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body to get the updated content object.
    const updatedContent = await request.json();
    // Acquire a client from the connection pool.
    const client = await pool.connect();

    // Iterate over each key-value pair in the updated content.
    for (const key in updatedContent) {
      // Ensure the property belongs to the object itself, not its prototype chain.
      if (Object.prototype.hasOwnProperty.call(updatedContent, key)) {
        const value = updatedContent[key];
        // Execute an UPSERT (UPDATE or INSERT) SQL query.
        // If the key already exists, update its value; otherwise, insert a new row.
        await client.query(
          'INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, JSON.stringify(value)] // Convert value to JSON string for storage.
        );
      }
    }
    // Release the client back to the pool.
    client.release();

    // Return a success response if content was saved successfully.
    return NextResponse.json({ message: 'Content saved successfully!' }, { status: 200 });
  } catch (error) {
    // Log the error and return an error response if content saving fails.
    console.error('Error saving content to database:', error);
    return NextResponse.json({ message: 'Failed to save content.', error: (error as Error).message }, { status: 500 });
  }
}
