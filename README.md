# Harshit Sharma's Personal Portfolio

## Project Overview

This is my personal portfolio application, meticulously crafted with Next.js to showcase my work, skills, and provide a direct way for visitors to connect with me. All content, including my hero section details, about me paragraphs, projects, skills, and contact information, is dynamically managed through a secure, integrated admin panel and stored in a PostgreSQL database (Neon DB). This application serves as a comprehensive and interactive representation of my professional capabilities.

## Features

*   **Dynamic Content Management:** All major sections of the portfolio (Hero, About, Projects, Skills, Connect, Footer) can be updated via a secure admin panel, allowing for easy content updates without code changes.
*   **Interactive 3D Model:** A prominent 3D model in the hero section, featuring customizable rotation speed and animation settings, adding a unique visual element.
*   **Responsive Design:** Optimized for both desktop and mobile experiences, ensuring a consistent and engaging view across devices (with a specific message for mobile users).
*   **Loading Screen:** A custom loading screen with a video and dynamic messages provides a smooth and engaging entry experience.
*   **Project Showcase:** Dedicated sections for development and design projects, complete with image uploads via Cloudinary for rich media display.
*   **Skills Display:** A dynamic, scrolling display of my technical and professional skills.
*   **Contact Form:** A functional contact form enables visitors to send messages directly to me.
*   **Dynamic Resume Download:** I can easily upload and update my resume PDF via the admin panel, with the file securely hosted on Cloudinary.
*   **Authentication:** Secure admin panel access is managed using NextAuth.js.
*   **Database Integration:** Utilizes PostgreSQL (Neon DB) for persistent and reliable storage of all portfolio content.
*   **Vercel Blob Integration:** Leverages Vercel Blob for efficient storage and global delivery of the resume PDF.

## Technologies Used

*   **Framework:** Next.js (React Framework)
*   **Styling:** Tailwind CSS
*   **Database:** PostgreSQL (Neon DB)
*   **ORM/Driver:** `pg` (Node.js PostgreSQL client)
*   **Authentication:** NextAuth.js
*   **3D Graphics:** React Three Fiber, Drei, Blender (for Three.js integration in React)
*   **File Storage:** Cloudinary (for images and PDFs)
*   **Video Compression:** FFmpeg (used locally for `loading.mp4` compression)
*   **Deployment:** Vercel
*   **Other Libraries:** `framer-motion`, `lucide-react`, `nodemailer`, `react-slick`, `slick-carousel`

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or Yarn
*   A PostgreSQL database (e.g., a free tier from Neon.tech)
*   A Cloudinary account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables. Replace the placeholder values with your actual credentials.

    ```env
    # NextAuth.js
    NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET_KEY # Generate a strong random string
    NEXTAUTH_URL=http://localhost:3000 # Or your deployment URL

    # PostgreSQL (Neon DB)
    DATABASE_URL=YOUR_NEON_DATABASE_CONNECTION_STRING

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

    # Google API (for analytics/other integrations if used)
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

    # Nodemailer (for contact form emails)
    EMAIL_SERVER_USER=YOUR_EMAIL_USER
    EMAIL_SERVER_PASSWORD=YOUR_EMAIL_PASSWORD
    EMAIL_SERVER_HOST=YOUR_EMAIL_HOST
    EMAIL_SERVER_PORT=YOUR_EMAIL_PORT
    EMAIL_FROM=YOUR_EMAIL_FROM_ADDRESS
    ```
    *   **`NEXTAUTH_SECRET`**: You can generate a strong secret using `openssl rand -base64 32` or a similar tool.
    *   **`DATABASE_URL`**: Obtain this from your Neon.tech dashboard.
    *   **Cloudinary Keys**: Find these in your Cloudinary dashboard.

4.  **Database Setup (Initial Content):**
    Ensure your PostgreSQL database has a `config` table with `key` (TEXT) and `value` (JSONB) columns. You'll need to populate it with initial content, especially for the `connect` section to avoid issues with the resume upload. A minimal `connect` entry could be:

    ```sql
    INSERT INTO config (key, value) VALUES ('connect', '{}'::jsonb);
    ```
    You can then update the full content via the admin panel.

5.  **Video Compression (Optional but Recommended):**
    The `public/loading.mp4` video can be large. For better performance, compress it using FFmpeg:
    ```bash
    ffmpeg -i public/loading.mp4 -vcodec libx264 -crf 28 -preset medium -b:a 128k public/loading_compressed.mp4
    ```
    The application is configured to use `loading_compressed.mp4` if it exists.

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

2.  **Build for production:**
    ```bash
    npm run build
    # or
    yarn build
    ```

3.  **Start production server (after building):**
    ```bash
    npm run start
    # or
    yarn start
    ```

## Project Structure (Key Directories)

*   `app/`: Contains all Next.js App Router pages, layouts, and API routes.
    *   `app/api/`: Backend API routes (e.g., `content`, `contact`, `upload-image`, `upload-resume`, `skills`).
    *   `app/admin/`: Admin panel pages for content management.
    *   `app/components/`: Reusable React components (e.g., `Header`, `HeroSection`, `ThreeDModel`, `ConnectSection`).
    *   `app/fonts/`: Custom font files.
*   `public/`: Static assets like images, 3D models (`.glb`), and the loading video.
*   `lib/`: Utility functions or helper modules.
*   `scripts/`: Utility scripts (e.g., `migrate-content.js`).

## Admin Panel

Access the admin panel by navigating to `/admin` in your browser (e.g., [http://localhost:3000/admin](http://localhost:3000/admin)). You will be prompted to log in using the credentials configured via NextAuth.js.

From the admin panel, you can:
*   Edit text content for various sections.
*   Add/remove projects and upload project images.
*   Add/remove skills.
*   Upload your resume PDF (which will be hosted on Cloudinary).

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/). Ensure all environment variables are correctly set in your Vercel project settings.

## Connect with Me

Feel free to reach out or connect! I'm always open to discussing new opportunities, collaborations, or just chatting about technology.

*   **GitHub:** https://github.com/H-sharma63
*   **LinkedIn:** https://www.linkedin.com/in/harshitsharma1060/
*   **Email:** harshit.sharma1060@gmail.com,627harshit@gmail.com
