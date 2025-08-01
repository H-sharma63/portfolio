'use client';

// This component defines the footer section of the portfolio website.
// It displays copyright information and social media links, which are fetched dynamically.

import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail } from 'lucide-react'; // Icons for social media links

// Define the structure for the footer content fetched from the API.
interface FooterContent {
  copyright: string; // Copyright text (e.g., "© 2023 Harshit Sharma")
  socialLinks: {
    github: string; // URL for GitHub profile.
    linkedin: string; // URL for LinkedIn profile.
    mail: string; // Email address.
  };
}

/**
 * Footer component.
 * Displays copyright information and social media icons with links.
 * Content is fetched from the /api/content endpoint.
 */
export default function Footer() {
  // State to store the footer content fetched from the API.
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  // State to manage the loading status of the footer content.
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch footer content when the component mounts.
  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch footer content: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has a 'footer' object.
        setFooterContent(data.footer);
      } catch (error) {
        console.error('Error fetching footer content:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure.
      }
    };

    fetchFooterContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Render nothing or a loading spinner while footer content is being fetched.
  if (loading || !footerContent) {
    return null;
  }

  return (
    <footer className="w-full py-2 bg-[#3a3a3a] text-white text-center text-sm">
      <p className="mb-1">{footerContent.copyright}</p>
      <p className="mb-2 font-bold text-white/90 text-m">
        Exploring technology across design, development & AI.
      </p>
      {/* Social media icons with links. */}
      <div className="flex justify-center space-x-4">
        <a
          href={footerContent.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 transition-colors"
        >
          <Github size={20} /> {/* GitHub icon */}
        </a>
        <a
          href={footerContent.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 transition-colors"
        >
          <Linkedin size={20} /> {/* LinkedIn icon */}
        </a>
        <a
          href={`mailto:${footerContent.socialLinks.mail}`}
          className="text-white hover:text-gray-400 transition-colors"
        >
          <Mail size={20} /> {/* Mail icon */}
        </a>
      </div>
    </footer>
  );
}
