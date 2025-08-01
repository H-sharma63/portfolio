
'use client';

// This component displays a horizontally scrolling list of skills.
// It fetches the list of skills dynamically from an API and applies
// a continuous scrolling animation.

import React, { useState, useEffect } from 'react';
import './ScrollingSkills.css'; // Import custom CSS for the scrolling animation

// Define the structure for the skills content fetched from the API.
interface SkillsContent {
  heading: string; // The main heading for the skills section.
  skillList: string[]; // An array of strings, each representing a skill.
}

/**
 * ScrollingSkills component.
 * Displays a list of skills with a continuous horizontal scrolling effect.
 * Skill data is fetched from the /api/content endpoint.
 */
const ScrollingSkills = () => {
  // State to store the skills content fetched from the API.
  const [skillsContent, setSkillsContent] = useState<SkillsContent | null>(null);
  // State to control whether the scrolling animation should be active.
  const [isAnimated, setIsAnimated] = useState(false);

  // Effect hook to fetch skills content when the component mounts.
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch content: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has a 'skills' object.
        setSkillsContent(data.skills);
      } catch (error) {
        console.error('Error fetching skills content:', error);
      }
    };

    fetchContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Effect hook to enable animation if skills are loaded and user prefers motion.
  useEffect(() => {
    // Start animation only when skills are loaded and user has not set a preference for reduced motion.
    if (skillsContent && skillsContent.skillList.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsAnimated(true);
    }
  }, [skillsContent]); // Re-run when skillsContent changes.

  // Render nothing or a loading spinner while skills content is being fetched.
  if (!skillsContent) {
    return null; // Or a loading spinner if preferred.
  }

  return (
    <section id="skills" className="min-h-[300px] w-full flex flex-col items-center justify-center bg-[#3a3a3a] text-white">
      <h2 className="text-5xl font-black mb-12 text-center">{skillsContent.heading}</h2>
      {/* Scroller container for horizontal animation. */}
      <div className="scroller" data-speed="fast" data-animated={isAnimated ? 'true' : 'false'}>
        <ul className="tag-list scroller__inner font-black text-l">
          {/* Map through the skill list and render each skill as a list item. */}
          {skillsContent.skillList.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
          {/* Duplicate skills for seamless infinite scrolling animation. */}
          {isAnimated && skillsContent.skillList.map((skill, index) => (
            <li key={`duplicate-${index}`} aria-hidden="true">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ScrollingSkills;
