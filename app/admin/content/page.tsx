'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ToastNotification from '../../components/ToastNotification';
import Image from 'next/image';
import ImageUploadForm from '@/app/components/ImageUploadForm'; 

interface Project {
  title: string;
  projectLink: string;
  imageUrl?: string;
  buttonLabel?: string;
}

interface NavLink {
  id: string;
  text: string;
}

interface ContentData {
  header: {
    navLinks: NavLink[];
  };
  hero: {
    heading: string;
    subheading: string;
    buttonText: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
  };
  projects: {
    heading: string;
    developmentProjects: Project[];
    designProjects: Project[];
  };
  skills: {
    heading: string;
    skillList: string[];
  };
  connect: {
    heading: string;
    description: string;
    resumeUrl?: string; 
  };
  footer: {
    copyright: string;
    socialLinks: {
      github: string;
      linkedin: string;
      mail: string;
    };
  };
  modelSettings: {
    modelUrl: string;
    rotationSpeed: number;
    scale: number;
    lightIntensity: number;
    lightColor: string;
  };
}

export default function AdminContentPage() {
  const { status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadMessage, setResumeUploadMessage] = useState('');
  const [minimizedSections, setMinimizedSections] = useState<{
    header: boolean;
    hero: boolean;
    about: boolean;
    projects: boolean;
    skills: boolean;
    connect: boolean;
    footer: boolean;
  }>({ header: false, hero: false, about: false, projects: false, skills: false, connect: false, footer: false });

  const toggleMinimize = (section: keyof typeof minimizedSections) => {
    setMinimizedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchContent();
    }
  }, [status, router]);

  const fetchContent = async () => {
    try {
      setLoadingContent(true);
      const res = await fetch('/api/content');
      if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.statusText}`);
      }
      const data: ContentData = await res.json();
      setContent(data);
    } catch (error: unknown) {
      console.error('Error fetching content:', error);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load content.' });
    } finally {
      setLoadingContent(false);
    }
  };

  const handleProjectChange = (projectType: 'developmentProjects' | 'designProjects', index: number, field: keyof Project, value: string) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newProjects = [...prevContent.projects[projectType]];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return {
        ...prevContent,
        projects: { ...prevContent.projects, [projectType]: newProjects },
      };
    });
  };

  const addProject = (projectType: 'developmentProjects' | 'designProjects') => {
    setContent(prevContent => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        projects: {
          ...prevContent.projects,
          [projectType]: [...prevContent.projects[projectType], { title: '', projectLink: '', imageUrl: '' }],
        },
      };
    });
  };

  const removeProject = (projectType: 'developmentProjects' | 'designProjects', index: number) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newProjects = prevContent.projects[projectType].filter((_, i) => i !== index);
      return {
        ...prevContent,
        projects: { ...prevContent.projects, [projectType]: newProjects },
      };
    });
  };

  const handleParagraphChange = (index: number, value: string) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newParagraphs = [...prevContent.about.paragraphs];
      newParagraphs[index] = value;
      return {
        ...prevContent,
        about: { ...prevContent.about, paragraphs: newParagraphs },
      };
    });
  };

  const addParagraph = () => {
    setContent(prevContent => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          paragraphs: [...prevContent.about.paragraphs, ''],
        },
      };
    });
  };

  const removeParagraph = (index: number) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newParagraphs = prevContent.about.paragraphs.filter((_, i) => i !== index);
      return {
        ...prevContent,
        about: { ...prevContent.about, paragraphs: newParagraphs },
      };
    });
  };

  const addNavLink = () => {
    setContent(prevContent => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        header: {
          ...prevContent.header,
          navLinks: [...prevContent.header.navLinks, { id: '', text: '' }],
        },
      };
    });
  };

  const removeNavLink = (index: number) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newNavLinks = prevContent.header.navLinks.filter((_, i) => i !== index);
      return {
        ...prevContent,
        header: { ...prevContent.header, navLinks: newNavLinks },
      };
    });
  };

  const handleNavLinkChange = (index: number, field: keyof NavLink, value: string) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newNavLinks = [...prevContent.header.navLinks];
      newNavLinks[index] = { ...newNavLinks[index], [field]: value };
      return {
        ...prevContent,
        header: { ...prevContent.header, navLinks: newNavLinks },
      };
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newSkillList = [...prevContent.skills.skillList];
      newSkillList[index] = value;
      return {
        ...prevContent,
        skills: { ...prevContent.skills, skillList: newSkillList },
      };
    });
  };

  const addSkill = () => {
    setContent(prevContent => {
      if (!prevContent) return null;
      return {
        ...prevContent,
        skills: {
          ...prevContent.skills,
          skillList: [...prevContent.skills.skillList, ''],
        },
      };
    });
  };

  const removeSkill = (index: number) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      const newSkillList = prevContent.skills.skillList.filter((_, i) => i !== index);
      return {
        ...prevContent,
        skills: { ...prevContent.skills, skillList: newSkillList },
      };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      setResumeUploadMessage('Please select a file first.');
      return;
    }

    setUploadingResume(true);
    setResumeUploadMessage('');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResumeUploadMessage(`Upload successful! New URL: ${data.url}`);
        // Optionally, update the content state if you want to display the new URL immediately
        setContent(prevContent => {
          if (!prevContent) return null;
          return {
            ...prevContent,
            connect: {
              ...prevContent.connect,
              resumeUrl: data.url, // Assuming resumeUrl is directly under connect
            },
          };
        });
        setSelectedFile(null); // Clear selected file
      } else {
        setResumeUploadMessage(`Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setResumeUploadMessage('An error occurred during upload.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setToast(null); // Clear any existing toast
    try {
      const contentRes = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!contentRes.ok) {
        throw new Error(`Failed to save content: ${contentRes.statusText}`);
      }

      const skillsRes = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content.skills.skillList),
      });

      if (!skillsRes.ok) {
        throw new Error(`Failed to save skills: ${skillsRes.statusText}`);
      }

      setToast({ type: 'success', message: 'Content saved successfully!' });
    } catch (error: unknown) {
      console.error('Error saving content:', error);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loadingContent) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a3a3a] text-white text-4xl font-black overflow-hidden">Loading content management...</div>;
  }

  if (status === 'authenticated') {
    function handleInputChange(section: keyof ContentData, field: string, value: string): void {
      setContent(prevContent => {
      if (!prevContent) return null;
      // Handle nested objects
      if (section === 'hero' || section === 'about' || section === 'projects' || section === 'skills' || section === 'connect' || section === 'footer') {
        return {
        ...prevContent,
        [section]: {
          ...prevContent[section],
          [field]: value,
        },
        };
      }
      // For header, only allow changing navLinks via dedicated handler
      return prevContent;
      });
    }
    return (
      <div className="min-h-screen bg-[#3a3a3a] text-white p-8">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-[#CFCFCF] font-bold text-2xl py-2 px-4 rounded"
          >
            ←
          </button>
          <h1 className="text-4xl font-black text-center flex-grow">Content Management</h1>
        </div>
        <p className="text-gray-300 text-center mb-8">Edit your portfolio&apos;s text content below.</p>

        {content && (
          <div className="space-y-8">
            {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
            {/* Header Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Header
                <button
                  onClick={() => toggleMinimize('header')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.header ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.header && (
                <label className="block mb-2">
                  <span className="text-gray-400">Navigation Links:</span>
                  {content.header.navLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={link.text}
                        onChange={(e) => handleNavLinkChange(index, 'text', e.target.value)}
                        placeholder="Link Text"
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={link.id}
                        onChange={(e) => handleNavLinkChange(index, 'id', e.target.value)}
                        placeholder="Link ID (e.g., home, about)"
                      />
                      <button
                        onClick={() => removeNavLink(index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addNavLink}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mt-2"
                  >
                    + Add Link
                  </button>
                </label>
              )}
            </div>

            {/* Hero Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Hero Section
                <button
                  onClick={() => toggleMinimize('hero')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.hero ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.hero && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Heading:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.hero.heading}
                      onChange={(e) => handleInputChange('hero', 'heading', e.target.value)}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">Subheading:</span>
                    <textarea
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.hero.subheading}
                      onChange={(e) => handleInputChange('hero', 'subheading', e.target.value)}
                      rows={2}
                    ></textarea>
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">Button Text:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.hero.buttonText}
                      onChange={(e) => handleInputChange('hero', 'buttonText', e.target.value)}
                    />
                  </label>
                </>
              )}
            </div>

            {/* About Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                About Section
                <button
                  onClick={() => toggleMinimize('about')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.about ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.about && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Heading:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.about.heading}
                      onChange={(e) => handleInputChange('about', 'heading', e.target.value)}
                    />
                  </label>
                  <span className="text-gray-400 block mb-2">Paragraphs:</span>
                  {content.about.paragraphs.map((paragraph, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <textarea
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        rows={4}
                      ></textarea>
                      <button
                        onClick={() => removeParagraph(index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addParagraph}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mt-2"
                  >
                    + Add Paragraph
                  </button>
                </>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Projects Section
                <button
                  onClick={() => toggleMinimize('projects')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.projects ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.projects && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Heading:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.projects.heading}
                      onChange={(e) => handleInputChange('projects', 'heading', e.target.value)}
                    />
                  </label>

                  {/* Development Projects */}
                  <h3 className="text-xl font-semibold mb-2 mt-4">Development Projects</h3>
                  {content.projects.developmentProjects.map((project, index) => (
                    <div key={index} className="flex flex-col space-y-2 mb-4 p-3 border border-gray-700 rounded">
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={project.title}
                        onChange={(e) => handleProjectChange('developmentProjects', index, 'title', e.target.value)}
                        placeholder="Project Title"
                      />
                      <input
                        type="url"
                        className="w-full p-2 rounded bg-gray-700 text-white border border--gray-600"
                        value={project.projectLink ?? ''}
                        onChange={(e) => handleProjectChange('developmentProjects', index, 'projectLink', e.target.value)}
                        placeholder="Project Link (URL)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={project.buttonLabel ?? ''}
                        onChange={(e) => handleProjectChange('developmentProjects', index, 'buttonLabel', e.target.value)}
                        placeholder="Button Label (e.g., GitHub Link)"
                      />
                      {/* Image Upload for Development Project */}
                      <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                        <h4 className="text-lg font-semibold mb-2">Project Image</h4>
                        <ImageUploadForm onUploadSuccess={(url) => handleProjectChange('developmentProjects', index, 'imageUrl', url)} />
                        {project.imageUrl && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400">Current Image:</p>
                            <Image src={project.imageUrl} alt="Project Preview" width={150} height={100} className="h-auto rounded mt-1" />
                            <p className="text-xs text-gray-500 break-all">{project.imageUrl}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeProject('developmentProjects', index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded self-end"
                      >
                        Remove Project
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addProject('developmentProjects')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mt-2"
                  >
                    + Add Development Project
                  </button>

                  {/* Design Projects */}
                  <h3 className="text-xl font-semibold mb-2 mt-4">Design Projects</h3>
                  {content.projects.designProjects.map((project, index) => (
                    <div key={index} className="flex flex-col space-y-2 mb-4 p-3 border border-gray-700 rounded">
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={project.title}
                        onChange={(e) => handleProjectChange('designProjects', index, 'title', e.target.value)}
                        placeholder="Project Title"
                      />
                      <input
                        type="url"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={project.projectLink ?? ''}
                        onChange={(e) => handleProjectChange('designProjects', index, 'projectLink', e.target.value)}
                        placeholder="Project Link (URL)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={project.buttonLabel ?? ''}
                        onChange={(e) => handleProjectChange('designProjects', index, 'buttonLabel', e.target.value)}
                        placeholder="Button Label (e.g., Figma File)"
                      />
                      {/* Image Upload for Design Project */}
                      <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                        <h4 className="text-lg font-semibold mb-2">Project Image</h4>
                        <ImageUploadForm onUploadSuccess={(url) => handleProjectChange('designProjects', index, 'imageUrl', url)} />
                        {project.imageUrl && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-400">Current Image:</p>
                            <Image src={project.imageUrl} alt="Project Preview" width={150} height={100} className="h-auto rounded mt-1" />
                            <p className="text-xs text-gray-500 break-all">{project.imageUrl}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeProject('designProjects', index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded self-end"
                      >
                        Remove Project
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addProject('designProjects')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mt-2"
                  >
                    + Add Design Project
                  </button>
                </>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Skills Section
                <button
                  onClick={() => toggleMinimize('skills')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.skills ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.skills && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Heading:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.skills.heading}
                      onChange={(e) => handleInputChange('skills', 'heading', e.target.value)}
                    />
                  </label>
                  
                  <span className="text-gray-400 block mb-2">Skills:</span>
                  {content.skills.skillList.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mt-2"
                  >
                    + Add Skill
                  </button>
                </>
              )}
            </div>

            {/* Let's Connect Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Let&apos;s Connect Section
                <button
                  onClick={() => toggleMinimize("connect")}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.connect ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.connect && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Heading:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.connect.heading}
                      onChange={(e) => handleInputChange('connect', 'heading', e.target.value)}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">Description:</span>
                    <textarea
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.connect.description}
                      onChange={(e) => handleInputChange('connect', 'description', e.target.value)}
                      rows={2}
                    ></textarea>
                  </label>
                  <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                    <h4 className="text-lg font-semibold mb-2">Upload Resume PDF</h4>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      disabled={uploadingResume}
                      className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    />
                    <button
                      onClick={handleUploadResume}
                      disabled={!selectedFile || uploadingResume}
                      className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
                    </button>
                    {resumeUploadMessage && <p className="mt-2 text-sm text-gray-400">{resumeUploadMessage}</p>}
                    {content.connect.resumeUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400">Current Resume URL:</p>
                        <a href={content.connect.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 break-all hover:underline">
                          {content.connect.resumeUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                Footer Section
                <button
                  onClick={() => toggleMinimize('footer')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  {minimizedSections.footer ? '+' : '-'}
                </button>
              </h2>
              {!minimizedSections.footer && (
                <>
                  <label className="block mb-4">
                    <span className="text-gray-400">Copyright Text:</span>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.footer.copyright}
                      onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">GitHub Link:</span>
                    <input
                      type="url"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.footer.socialLinks.github}
                      onChange={(e) => setContent(prev => prev ? { ...prev, footer: { ...prev.footer, socialLinks: { ...prev.footer.socialLinks, github: e.target.value } } } : null)}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">LinkedIn Link:</span>
                    <input
                      type="url"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.footer.socialLinks.linkedin}
                      onChange={(e) => setContent(prev => prev ? { ...prev, footer: { ...prev.footer, socialLinks: { ...prev.footer.socialLinks, linkedin: e.target.value } } } : null)}
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-400">Mail Address:</span>
                    <input
                      type="email"
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                      value={content.footer.socialLinks.mail}
                      onChange={(e) => setContent(prev => prev ? { ...prev, footer: { ...prev.footer, socialLinks: { ...prev.footer.socialLinks, mail: e.target.value } } } : null)}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
              >
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}