'use client';

// This component provides a customizable toast notification system.
// It can display success or error messages and automatically disappears after a few seconds.

import React, { useEffect, useState } from 'react';

// Define the props for the ToastNotification component.
interface ToastProps {
  message: string; // The message to be displayed in the toast.
  type: 'success' | 'error'; // The type of toast, which determines its styling (e.g., color, icon).
  onClose: () => void; // Callback function to be called when the toast is closed (e.g., after its timeout).
}

/**
 * ToastNotification component.
 * Displays a temporary notification message to the user.
 * Automatically hides after a set duration.
 *
 * @param {ToastProps} { message, type, onClose } - Props for the component.
 */
const ToastNotification: React.FC<ToastProps> = ({ message, type, onClose }) => {
  // State to control the visibility of the toast notification.
  const [isVisible, setIsVisible] = useState(true);

  // Effect hook to set a timer for automatically closing the toast.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the toast.
      onClose(); // Call the onClose callback.
    }, 3000); // Toast disappears after 3 seconds (3000 milliseconds).

    // Cleanup function to clear the timer if the component unmounts early
    // or if the toast is manually closed before the timer expires.
    return () => clearTimeout(timer);
  }, [onClose]); // Dependency on 'onClose' to ensure the effect re-runs if the callback changes.

  // If the toast is not visible, render nothing.
  if (!isVisible) return null;

  // Determine background and border colors based on the toast type.
  const bgColor = type === 'success' ? 'bg-[#3a3a3a]' : 'bg-red-700';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white border ${bgColor} ${borderColor} transition-opacity duration-300`}
      style={{ zIndex: 1000 }} // Ensure the toast appears above other content.
    >
      <div className="flex items-center">
        {/* Success icon, displayed if type is 'success'. */}
        {type === 'success' && (
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        )}
        {/* Error icon, displayed if type is 'error'. */}
        {type === 'error' && (
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        )}
        <span>{message}</span> {/* The message content. */}
      </div>
    </div>
  );
};

export default ToastNotification;
