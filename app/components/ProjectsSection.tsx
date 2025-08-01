'use client';

// This component displays a section dedicated to portfolio projects.
// It categorizes projects into "Development Projects" and "Design Projects"
// and features horizontally scrolling carousels for each category.
// Project data is fetched dynamically from an API.

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Next.js Image component for optimized image loading

// Define the structure for the entire projects content fetched from the API.
interface ProjectsContent {
  heading: string; // Main heading for the projects section.
  developmentProjects: Project[]; // Array of development project objects.
  designProjects: Project[]; // Array of design project objects.
}

// Define the structure for a single project object.
interface Project {
  title: string; // Title of the project.
  projectLink: string; // URL link related to the project (e.g., GitHub, Figma, external website).
  imageUrl: string; // URL of the project's image.
  buttonLabel?: string; // Optional: Text for the project button (e.g., "View on Figma", "GitHub Link").
}

/**
 * ProjectsSection component.
 * Displays a collection of development and design projects with animated scrolling.
 * Project data is fetched from the /api/content endpoint.
 */
export default function ProjectsSection() {
  // State to store the projects content fetched from the API.
  const [projectsContent, setProjectsContent] = useState<ProjectsContent | null>(null);
  // State to manage the loading status of the projects content.
  const [loading, setLoading] = useState(true);
  // State to control whether the scrolling animation should be active.
  const [isAnimated, setIsAnimated] = useState(false);

  // Effect hook to fetch projects content when the component mounts.
  useEffect(() => {
    const fetchProjectsContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch projects content: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has a 'projects' object.
        setProjectsContent(data.projects);
      } catch (error) {
        console.error('Error fetching projects content:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure.
      }
    };

    fetchProjectsContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Effect hook to enable animation if projects exist and user prefers motion.
  useEffect(() => {
    if (projectsContent && (projectsContent.developmentProjects.length > 0 || projectsContent.designProjects.length > 0) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsAnimated(true);
    }
  }, [projectsContent]); // Re-run when projectsContent changes.

  // Render nothing or a loading spinner while projects content is being fetched.
  if (loading || !projectsContent) {
    return null; // Or a loading spinner if preferred.
  }

  return (
    <section id="projects" className="min-h-screen w-full flex items-center justify-center bg-[#3a3a3a] text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-4 text-left">
        <h2 className="text-5xl font-black mb-6 text-center">{projectsContent.heading}</h2>

        {/* Development Projects Section */}
        <h3 className="text-4xl font-bold mb-4 mt-8 text-[#CFCFCF] text-center">Development Projects</h3>
        {/* Scroller container for horizontal animation. */}
        <div className="scroller" data-speed="slow" data-animated={isAnimated ? 'true' : 'false'}>
          <div className="scroller__inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Map through development projects and render each project card. */}
            {projectsContent.developmentProjects.map((project, index) => (
              <div key={index} className="p-12 px-4">
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#CFCFCF] w-[300px] h-[350px] flex flex-col justify-between mx-auto project-card">
                  <div className="border-[1.5px] border-[#CFCFCF] w-[260px] h-[200px] mb-4 rounded-[10px] overflow-hidden mx-auto ml-[-5px]">
                    {/* Display project image or a placeholder if not available. */}
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} width={260} height={200} className="w-full h-full object-cover" />
                    ) : (
                      <Image src="https://dummyimage.com/260x200/000/fff" alt="Placeholder" width={260} height={200} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h4 className="text-2xl font-semibold mb-2 text-bottom">{project.title}</h4>
                  {/* Link to the project's GitHub repository. */}
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-[#3a3a3a] bg-[#CFCFCF] px-4 py-2 rounded-full font-black text-center hover:bg-[#ffffff] transition-colors w-[280px] block mx-auto mt-auto ml-[-15px]">
                    {project.buttonLabel || 'GitHub Link'}
                  </a>
                </div>
              </div>
            ))}
            {/* Duplicate projects for seamless infinite scrolling animation. */}
            {isAnimated && projectsContent.developmentProjects.map((project, index) => (
              <div key={`duplicate-${index}`} aria-hidden="true" className="p-12 px-4">
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#CFCFCF] w-[300px] h-[350px] flex flex-col justify-between mx-auto project-card">
                  <div className="border-[1.5px] border-[#CFCFCF] w-[260px] h-[200px] mb-4 rounded-[10px] overflow-hidden mx-auto ml-[-5px]">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} width={260} height={200} className="w-full h-full object-cover" />
                    ) : (
                      <Image src="https://dummyimage.com/260x200/000/fff" alt="Placeholder" width={260} height={200} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h4 className="text-2xl font-semibold mb-2 text-bottom">{project.title}</h4>
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-[#3a3a3a] bg-[#CFCFCF] px-4 py-2 rounded-full font-black text-center hover:bg-[#ffffff] transition-colors w-[280px] block mx-auto mt-auto ml-[-15px]">
                    {project.buttonLabel || 'GitHub Link'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Design Projects Section */}
        <h3 className="text-4xl font-bold mb-4 mt-8 text-[#CFCFCF] text-center">Design Projects</h3>
        {/* Scroller container for horizontal animation, with a different direction. */}
        <div className="scroller" data-speed="slow" data-animated={isAnimated ? 'true' : 'false'} data-direction="right">
          <div className="scroller__inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Map through design projects and render each project card. */}
            {projectsContent.designProjects.map((project, index) => (
              <div key={index} className="px-4">
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#CFCFCF] w-[300px] h-[350px] flex flex-col justify-between mx-auto project-card">
                  <div className="border border-[#CFCFCF] w-[260px] h-[200px] mb-4 rounded-[10px] overflow-hidden mx-auto ml-[-5px]">
                    {/* Display project image or a placeholder if not available. */}
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} width={260} height={200} className="w-full h-full object-cover" />
                    ) : (
                      <Image src="https://dummyimage.com/260x200/000/fff" alt="Placeholder" width={260} height={200} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h4 className="text-2xl font-semibold mb-2 text-bottom">{project.title}</h4>      
                  {/* Link to the project. */}
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-[#3a3a3a] bg-[#CFCFCF] px-4 py-2 rounded-full font-black text-center hover:bg-[#ffffff] transition-colors w-[280px] block mx-auto mt-auto ml-[-15px]">
                    {project.buttonLabel || 'Figma File'}
                  </a>
                </div>
              </div>
            ))}
            {/* Duplicate projects for seamless infinite scrolling animation. */}
            {isAnimated && projectsContent.designProjects.map((project, index) => (
              <div key={`duplicate-${index}`} aria-hidden="true">
                <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#CFCFCF] w-[300px] h-[350px] flex flex-col justify-between mx-auto project-card">
                  <div className="border border-[#CFCFCF] w-[260px] h-[200px] mb-4 rounded-[10px] overflow-hidden mx-auto ml-[-5px]">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.title} width={260} height={200} className="w-full h-full object-cover" />
                    ) : (
                      <Image src="https://dummyimage.com/260x200/000/fff" alt="Placeholder" width={260} height={200} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h4 className="text-2xl font-semibold mb-2 text-bottom">{project.title}</h4>      
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-[#3a3a3a] bg-[#CFCFCF] px-4 py-2 rounded-full font-black text-center hover:bg-[#ffffff] transition-colors w-[280px] block mx-auto mt-auto ml-[-15px]">
                    {project.buttonLabel || 'Figma File'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}