import React, { useState } from 'react';
import { db } from '../../store/firebase-config'; // Firebase Firestore
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddTurf = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [pricePerHour, setPricePerHour] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Image Upload State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
        toast.error('Only JPEG, PNG, and GIF files are allowed.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    setUploading(true);
    setProgress(0);

    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5003/upload',
          { data: reader.result },
          {
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentage);
            },
          }
        );
        const url = response.data.url;
        setUploadedUrl(url);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error during upload:', error);
        toast.error('Image upload failed.');
      } finally {
        setUploading(false);
      }
    };
  };

  const handleAddTurf = async (e) => {
    e.preventDefault();

    if (!name || !description || !pricePerHour || !availability || !location || !uploadedUrl) {
      toast.error('All fields, including the image, are required!');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'turfs'), {
        name,
        description, // Save the description in the Firestore document
        pricePerHour,
        availability,
        location,
        imageUrl: uploadedUrl, // Include the uploaded image URL in the turf document
        createdAt: new Date().toISOString(),
      });

      toast.success('New turf added successfully!');
      setName('');
      setDescription(''); // Reset the description field
      setPricePerHour('');
      setAvailability('');
      setLocation('');
      setUploadedUrl(''); // Clear the uploaded image
    } catch (error) {
      console.error('Failed to add turf:', error);
      toast.error('Failed to add turf!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Turf</h2>

      {/* Turf Details Form */}
      <form onSubmit={handleAddTurf}>
        <div className="mb-4">
          <label className="block text-gray-700">Turf Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Price Per Hour</label>
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            required
          >
            <option value="">Select Availability</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Turf Image</h4>
          <input type="file" onChange={handleFileChange} />
          {preview && (
            <div className="mt-2">
              <h4 className="text-md font-semibold">Preview</h4>
              <img src={preview} alt="Preview" className="max-w-full rounded-md" />
            </div>
          )}
          <button
            type="button"
            onClick={handleUpload}
            className={`mt-2 px-4 py-2 rounded-md text-white ${
              uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {uploading && (
            <div className="mt-2">
              <progress value={progress} max="100" className="w-full"></progress>
              <p className="text-gray-600 text-sm">{progress}%</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full text-white py-2 rounded-md ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding Turf...' : 'Add Turf'}
        </button>
      </form>
    </div>
  );
};

export default AddTurf;
