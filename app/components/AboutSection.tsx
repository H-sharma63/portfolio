'use client';

// This component represents the "About Me" section of the portfolio.
// It displays a heading and multiple paragraphs of text, fetched dynamically from an API.

import React, { useState, useEffect } from "react";

// Define the structure for the about content fetched from the API.
interface AboutContent {
  heading: string; // The main heading for the about section.
  paragraphs: string[]; // An array of strings, each representing a paragraph of text.
}

/**
 * AboutSection component.
 * Displays information about the portfolio owner.
 * Content is fetched from the /api/content endpoint.
 */
export default function AboutSection() {
  // State to store the about content fetched from the API.
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  // State to manage the loading status of the about content.
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch about content when the component mounts.
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch about content: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has an 'about' object.
        setAboutContent(data.about);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure.
      }
    };

    fetchAboutContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Render nothing or a loading spinner while about content is being fetched.
  if (loading || !aboutContent) {
    return null; // Or a loading spinner if preferred.
  }

  return (
    <section id="about" className="w-full flex items-center justify-center bg-[#3a3a3a] text-white">
      <div className="max-w-4xl mx-auto p-8 text-left">
        <h2 className="text-5xl font-black mb-6 text-center">{aboutContent.heading}</h2>
        {/* Map through the paragraphs array and render each one. */}
        {aboutContent.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg leading-relaxed text-[#CFCFCF] font-medium mb-4 text-center">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}