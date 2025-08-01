import React, { useState, useEffect } from "react";

// Define the structure for a navigation link object.
interface NavLink {
  id: string; // Unique identifier for the section (e.g., 'home', 'about')
  text: string; // Display text for the navigation link (e.g., 'Home', 'About Me')
}

/**
 * Header component for the portfolio website.
 * Displays navigation links and highlights the currently active section.
 * Navigation links are fetched dynamically from an API endpoint.
 *
 * @param {string} activeSection - The ID of the currently active section, used to highlight the corresponding navigation link.
 */
const Header = ({ activeSection }: { activeSection: string }) => {
  // State to store the fetched navigation links.
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  // State to manage the loading status of the navigation links.
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch navigation links when the component mounts.
  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        // Fetch navigation data from the local API route.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch navigation links: ${res.statusText}`);
        }
        const data = await res.json();
        // Assuming the API response has a structure like { header: { navLinks: [...] } }
        setNavLinks(data.header.navLinks);
      } catch (error) {
        console.error('Error fetching navigation links:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchNavLinks();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Render nothing or a loading indicator while navigation links are being fetched.
  if (loading) {
    return null; // Or a loading spinner if preferred
  }

  return(
    <header className="fixed top-8 w-full flex justify-center z-50">
      <nav className="bg-black bg-opacity-20 backdrop-blur-lg rounded-full px-6 py-3">
        <ul className="flex items-center gap-x-8 relative">
          {/* Map through the fetched navigation links to render each one. */}
          {navLinks.map((link) => (
            <li
              key={link.id} // Unique key for list items
              className={`relative px-4 py-2 z-10 rounded-full ${activeSection === link.id ? 'bg-[#4a4a4a]' : ''} transition-colors duration-300`}
            >
              <a
                href="#" // Placeholder href, actual navigation is handled by onClick
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor link behavior
                  const targetElement = document.getElementById(link.id); // Get the target section element by its ID
                  if (targetElement) {
                    // Smoothly scroll to the target section.
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without hash and without adding to history
                    // This keeps the URL clean while still allowing smooth scrolling.
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                  }
                }}
                className="text-white hover:text-gray-300 font-bold relative z-20"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
export default Header;