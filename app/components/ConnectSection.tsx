'use client';

// This component provides a contact section for the portfolio.
// It includes a description, social media links, and a contact form.
// Content is fetched dynamically, and form submissions are handled via an API.

import React, { useState, useEffect } from 'react';
import ToastNotification from './ToastNotification'; // Import the ToastNotification component for user feedback

// Define the structure for the connect content fetched from the API.
interface ConnectContent {
  heading: string; // Main heading for the connect section.
  description: string; // Descriptive text for the section.
  socialLinks: {
    github: string; // URL for GitHub profile.
    linkedin: string; // URL for LinkedIn profile.
    mail: string; // Email address(es), potentially comma-separated.
  };
  resumeUrl: string; // URL for the resume PDF.
}

/**
 * ConnectSection component.
 * Provides a contact form and social media links.
 * Content is fetched from the /api/content endpoint.
 * Form submissions are sent to the /api/contact endpoint.
 */
export default function ConnectSection() {
  // State to store the connect content fetched from the API.
  const [connectContent, setConnectContent] = useState<ConnectContent | null>(null);
  // State to manage the loading status of the connect content.
  const [loading, setLoading] = useState(true);
  // States for the contact form input fields.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // State for displaying toast notifications (success/error messages).
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // State to prevent multiple form submissions while one is in progress.
  const [isSending, setIsSending] = useState(false);

  // Effect hook to fetch connect content when the component mounts.
  useEffect(() => {
    const fetchConnectContent = async () => {
      try {
        // Fetch data from the local API route for content.
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error(`Failed to fetch connect content: ${res.statusText}`);
        }
        const data = await res.json();
        // Set connect content, assuming social links are part of the footer data.
        setConnectContent({
          ...data.connect,
          socialLinks: data.footer.socialLinks, // Assuming social links are in footer
          resumeUrl: data.connect.resumeUrl, // Assuming resume URL is in connect
        });
      } catch (error) {
        console.error('Error fetching connect content:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure.
      }
    };

    fetchConnectContent();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  /**
   * Handles the submission of the contact form.
   * Prevents default form submission, validates fields, and sends data to the API.
   * Displays toast notifications based on the API response.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setIsSending(true); // Disable the submit button to prevent multiple clicks.
    setToast(null); // Clear any existing toast notifications.

    // Basic form validation.
    if (!name || !email || !message) {
      setToast({ type: 'error', message: 'Please fill in all fields.' });
      setIsSending(false);
      return;
    }

    try {
      // Send form data to the /api/contact endpoint.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json(); // Parse the JSON response from the API.

      if (response.ok) {
        setToast({ type: 'success', message: 'Your message has been sent! I will reach out to you shortly.' });
        // Clear form fields upon successful submission.
        setName('');
        setEmail('');
        setMessage('');
      } else {
        // Display error message from the API response.
        setToast({ type: 'error', message: `Failed to send message: ${data.message || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSending(false); // Re-enable the submit button.
    }
  };

  // Render a loading state if content is still being fetched.
  if (loading || !connectContent) {
    return (
      <section id="contact" className="w-full py-20 flex items-center justify-center bg-[#3a3a3a] text-white">
        <div className="max-w-7xl w-full flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-black mb-6">Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="w-full py-20 flex items-center justify-center bg-[#3a3a3a] text-white">
      <div className="max-w-7xl w-full flex flex-col items-center justify-center p-8">
        <h2 className="text-5xl font-black mb-12 text-center">{connectContent.heading}</h2>
        <div className="w-full flex flex-col md:flex-row items-start justify-center">

          {/* Left Side: Description and Social Links */}
          <div className="w-full md:w-1/2 flex flex-col items-center p-8">
            <p className="text-lg leading-relaxed font-medium mb-6 max-w-md text-center">
              {connectContent.description}
            </p>
            <div className="space-y-4 mt-8 ml-[20px]">
              <p className="text-lg text-[#CACACA] font-bold">
                <span className="w-24 inline-block">Email</span>: 
                {/* Display email addresses, handling multiple if comma-separated. */}
                {connectContent.socialLinks.mail.split(',').map((email, index) => (
                  <React.Fragment key={index}>
                    <a href={`mailto:${email.trim()}`} className={`text-white hover:underline  ${index === 1 ? 'ml-[105.5px]' : ''}${index === 0 ? 'ml-[5px]' : ''}`}>
                      {email.trim()}
                    </a>
                    {index < connectContent.socialLinks.mail.split(',').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
              <p className="text-lg text-[#CACACA] font-bold">
                <span className="w-24 inline-block">Github</span>: <a href={connectContent.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@H-sharma63</a>
              </p>
              <p className="text-lg text-[#CACACA] font-bold">
                <span className="w-24 inline-block">LinkedIn</span>: <a href={connectContent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">/harshitsharma1060</a>
              </p>
              <div className="mt-4">
                <a href={connectContent.resumeUrl} target="_blank" rel="noopener noreferrer" className="bg-[#CACACA] text-[#3a3a3a] rounded-[40px] py-3 px-6 font-bold hover:bg-[#B0B0B0] transition-colors ml-[100px] mt-[10px]">
                  Download Resume
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="w-full md:w-1/2 flex flex-col p-8">
            <form onSubmit={handleSubmit}>
              {/* Name input field */}
              <input
                type="text"
                placeholder="Your Name"
                className="bg-transparent border border-[#CACACA] text-white rounded-[20px] p-3 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-[#CACACA] ml-[80px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="mt-4">
                {/* Email input field */}
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent border border-[#CACACA] text-white rounded-[20px] p-3 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-[#CACACA] ml-[80px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                {/* Message textarea */}
                <textarea
                  placeholder="Your Message"
                  className="bg-transparent border border-[#CACACA] text-white rounded-[20px] p-3 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-[#CACACA] ml-[80px] custom-scrollbar"
                  rows={5}
                  style={{ resize: 'none' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-4 ml-[80px]">
                {/* Submit button for the form */}
                <button
                  type="submit"
                  disabled={isSending} // Disable button when sending to prevent multiple submissions
                  className="bg-[#CACACA] text-[#3a3a3a] rounded-[40px] py-3 px-6 w-full max-w-sm font-bold hover:bg-[#B0B0B0] transition-colors"
                >
                  {isSending ? 'Sending...' : 'Send Message'} {/* Change button text based on sending state */}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      {/* Toast notification component, displayed when 'toast' state is not null. */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)} // Allow closing the toast by setting toast state to null
        />
      )}
    </section>
  );
}
