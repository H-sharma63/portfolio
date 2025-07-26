'use client';

import { useState, useEffect } from 'react';
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ScrollingSkills from "./components/ScrollingSkills";
import ConnectSection from "./components/ConnectSection";
import Footer from "./components/Footer";

const MIN_DESKTOP_WIDTH = 768;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const loadingMessages = [
    "Loading your experience...",
    "Fetching 3D model data...",
    "Preparing the scene...",
    "Welcome to my portfolio!",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 1650); // Change message every 1.5 seconds

      // Minimum display time for the loading screen (e.g., 6.5 seconds)
      const minTimeTimer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, 6500);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(minTimeTimer);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading, loadingMessages.length]);

  useEffect(() => {
    if (minTimeElapsed) {
      setLoading(false);
    }
  }, [minTimeElapsed]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MIN_DESKTOP_WIDTH);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: null,
          rootMargin: '-50% 0px -50% 0px',
          threshold: 0,
        }
      );

      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      sections.forEach(id => {
        const sectionElement = document.getElementById(id);
        if (sectionElement) {
          observer.observe(sectionElement);
        }
      });

      return () => {
        sections.forEach(id => {
          const sectionElement = document.getElementById(id);
          if (sectionElement) {
            observer.unobserve(sectionElement);
          }
        });
      };
    }
  }, [loading]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#3a3a3a] text-white text-center p-4">
        <p className="text-xl font-bold">This Portfolio is currently under development for mobile devices. Please switch to a desktop or laptop for the best experience. <br />Thank you for your understanding.</p>
      </div>
    );
  }

  return (
    <main className="bg-[#3a3a3a] min-h-screen flex flex-col items-center justify-center text-white font-satoshi">
      {loading && (
        <div className="fixed inset-0 bg-[#3a3a3a] flex items-center justify-center z-50">
          <video
            src="/loading_compressed.mp4"
            autoPlay
            muted
            playsInline
            className="w-[800px] h-[600px] mix-blend-screen brightness-150"
          />
          <div className="absolute text-white text-2xl font-bold text-center">
            {loadingMessages[currentMessageIndex]}
          </div>
        </div>
      )}
      {!loading && <Header activeSection={activeSection} />}

      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ScrollingSkills />
      <ConnectSection />
      <Footer />
    </main>
  );
}
