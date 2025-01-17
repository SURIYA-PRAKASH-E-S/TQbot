const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dq7pfdfcj",
  api_key: "999318228515189",
  api_secret: "QvLiLbj1T7HdsP1wy4Sn8B5mrUY",
});

const app = express();

// Middleware Configurations
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Increase the request size limit
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Endpoint to Upload Images
app.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;

    if (!fileStr) {
      return res.status(400).json({ error: "No file data received" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "my_turf",
    });

    res.json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ error: "Upload failed. Please try again." });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
