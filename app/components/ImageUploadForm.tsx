'use client';

// This component provides a form for uploading images to Cloudinary.
// It allows users to select a file, view a preview, and handles the upload process
// including displaying messages and managing loading states.

import { useState } from 'react';
import Image from 'next/image'; // Next.js Image component for optimized image display

// Define the props for the ImageUploadForm component.
interface ImageUploadFormProps {
  onUploadSuccess?: (imageUrl: string) => void; // Optional callback function to be called on successful upload.
}

/**
 * ImageUploadForm component.
 * Handles image selection, upload to a backend API (presumably Cloudinary via that API),
 * and displays upload status and a preview of the uploaded image.
 *
 * @param {ImageUploadFormProps} { onUploadSuccess } - Props for the component.
 */
export default function ImageUploadForm({ onUploadSuccess }: ImageUploadFormProps) {
  // State to store the currently selected file for upload.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to indicate if an upload is currently in progress.
  const [uploading, setUploading] = useState(false);
  // State to store messages displayed to the user (e.g., success, error, loading).
  const [message, setMessage] = useState('');
  // State to store the URL of the uploaded image, used for displaying a preview.
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /**
   * Handles the change event when a file is selected in the input.
   * Sets the selected file and clears previous messages/image URLs.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]); // Get the first selected file.
      setMessage(''); // Clear any previous messages.
      setImageUrl(null); // Clear any previous image preview.
    }
  };

  /**
   * Handles the image upload process.
   * Validates if a file is selected, sets loading state, sends the file to the API,
   * and updates the UI based on the upload result.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true); // Set uploading state to true.
    setMessage('Uploading...'); // Display uploading message.

    // Create FormData to send the file as multipart/form-data.
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Send the file to the /api/upload-image endpoint.
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Parse the JSON response from the API.

      if (response.ok) {
        setMessage('Upload successful!'); // Display success message.
        setImageUrl(data.imageUrl); // Set the URL of the uploaded image.
        setSelectedFile(null); // Clear the selected file.
        // Call the optional onUploadSuccess callback if provided.
        if (onUploadSuccess) {
          onUploadSuccess(data.imageUrl);
        }
      } else {
        // Display error message from the API response.
        setMessage(`Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('An error occurred during upload.');
    } finally {
      setUploading(false); // Set uploading state to false.
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
      <h2>Upload Image to Cloudinary</h2>
      {/* File input for selecting an image. */}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {/* Upload button, disabled when no file is selected or upload is in progress. */}
      <button onClick={handleUpload} disabled={!selectedFile || uploading} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload Image'} {/* Change button text based on uploading state */}
      </button>
      {/* Display messages to the user. */}
      {message && <p style={{ marginTop: '10px', color: uploading ? 'blue' : (message.includes('failed') ? 'red' : 'green') }}>{message}</p>}
      {/* Display uploaded image preview if imageUrl is available. */}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image Preview:</h3>
          <Image src={imageUrl} alt="Uploaded" width={200} height={150} style={{ objectFit: 'cover', border: '1px solid #eee' }} />
          <p>URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
        </div>
      )}
    </div>
  );
}
