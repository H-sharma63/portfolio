'use client';

// This component represents the main hero section of the portfolio.
// It displays a 3D model, a heading, subheading, and a call-to-action button.
// The content for the hero section is fetched dynamically from an API.

import ThreeDModel from "./ThreeDModel"; // Component to display the 3D model
import React, { useState, useEffect } from "react";



// Define the structure for the hero content fetched from the API.
interface HeroContent {
  heading: string; // Main heading text (e.g., "Harshit Sharma")
  subheading: string; // Subheading text (e.g., "Portfolio of Harshit Sharma")
  buttonText: string; // Text for the call-to-action button (e.g., "Connect with me")
}

/**
 * HeroSection component.
 * Displays introductory content and a 3D model.
 * Content is fetched from the /api/content endpoint.
 *
 * @param {HeroSectionProps} { loading } - Props for the component, including the overall loading state.
 */
export default function HeroSection() {
  // State to store the hero content fetched from the API.
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  // State to manage the loading status of the hero content itself.
  const [contentLoading, setContentLoading] = useState(true);

  // Effect hook to fetch hero content when the component mounts.
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch hero content: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has a 'hero' object.
        setHeroContent(data.hero);
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setContentLoading(false); // Set content loading to false regardless of success or failure.
      }
    };

    fetchHeroContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Render nothing or a loading spinner while hero content is being fetched.
  if (contentLoading || !heroContent) {
    return null; // Or a loading spinner if preferred.
  }

  return (
    <div
      id="home" // ID for navigation (e.g., from Header component)
      className="flex items-center justify-center w-full bg-grid" // Styling for layout
    >
      {/* Container for the 3D model. */}
      <div className="w-[380px] h-[600px] flex justify-center ml-[-100px] flex-none">
        <ThreeDModel />
      </div>
      {/* Container for the text content (heading, subheading, button). */}
      <div className="w-1/2 flex flex-col items-center ml-[150px]">
        <h1 className="text-7xl font-black mb-2 whitespace-nowrap text-center">{heroContent.heading}</h1>
        <p className="text-xl text-gray-400 mb-6 text-center">{heroContent.subheading}</p>
        {/* Call-to-action button that scrolls to the 'contact' section. */}
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#CFCFCF] text-[#3a3a3a] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-200 transition-colors"
        >
          {heroContent.buttonText}
        </button>
      </div>
    </div>
  );
}