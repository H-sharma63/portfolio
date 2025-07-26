import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// This file configures NextAuth.js for authentication.
// It sets up Google as an authentication provider and defines
// a custom signIn callback to restrict access to specific admin emails.

const handler = NextAuth({
  // Define authentication providers.
  providers: [
    // Google OAuth 2.0 Provider.
    GoogleProvider({
      // Client ID and Client Secret are loaded from environment variables.
      // These are crucial for secure authentication with Google.
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Secret for NextAuth.js, used to sign and encrypt tokens.
  // It should be a long, random string and stored securely in environment variables.
  secret: process.env.NEXTAUTH_SECRET,
  // Callbacks allow for custom logic during different stages of the authentication flow.
  callbacks: {
    /**
     * signIn callback: Controls whether a user is allowed to sign in.
     * This implementation restricts sign-in to a predefined list of admin emails.
     * @param {object} { user } - The user object provided by the authentication provider.
     * @returns {boolean | string} - True if sign-in is allowed, false or a redirect URL otherwise.
     */
    async signIn({ user }) {
      // Retrieve allowed admin emails from environment variables, splitting by comma.
      const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim()) || [];
      const userEmail = user.email || '';

      // Check if the signing-in user's email is in the allowed admin email list.
      if (adminEmails.includes(userEmail)) {
        return true; // Allow sign-in.
      } else {
        // If not an admin, construct an error message and redirect to the admin page with the error.
        const error = `Login failed: User email '${userEmail}' is not in the allowed list of admin emails.'`;
        // Redirect to a custom error page with a detailed message.
        return `/admin?error=${encodeURIComponent(error)}`;
      }
    },
  },
});

// Export the NextAuth handler for both GET and POST requests.
// This makes the authentication API routes available.
export { handler as GET, handler as POST }
