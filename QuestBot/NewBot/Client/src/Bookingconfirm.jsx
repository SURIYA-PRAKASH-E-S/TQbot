import React, { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { saveImageMetadata } from "./firebaseUtils"; // Your Firebase helper function

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const response = await axios.post("http://localhost:5000/upload", {
          data: reader.result,
        });
        const url = response.data.url;
        setUploadedUrl(url);

        // Save to Firebase
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        await saveImageMetadata(url, userId);
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error(error);
        alert("Upload failed.");
      }
    };
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="200px" />}
      <button onClick={handleUpload}>Upload</button>
      {uploadedUrl && (
        <div>
          <h2>Uploaded Image</h2>
          <img src={uploadedUrl} alt="Uploaded" width="200px" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
