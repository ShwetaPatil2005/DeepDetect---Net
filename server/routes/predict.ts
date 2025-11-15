import express from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const router = express.Router();

// Setup multer for image upload
const upload = multer({ dest: "uploads/" });

// POST /api/predict
// Accepts either: file upload (multipart/form-data) or JSON body with { url: string }
// Cast multer middleware to any to avoid TypeScript overload conflicts between differing @types/express versions
router.post("/", upload.single("file") as any, async (req, res) => {
  try {
    let flaskResponse;

    // If a file is uploaded
    if (req.file) {
      const imagePath = req.file.path;

      const formData = new FormData();
      formData.append("file", fs.createReadStream(imagePath));

      flaskResponse = await axios.post("http://127.0.0.1:5001/predict", formData, {
        headers: formData.getHeaders(),
      });

      fs.unlinkSync(imagePath); // delete temp file
    } 
    // If an image URL is provided
    else if (req.body.url) {
      const imageUrl = req.body.url;

      // Download image temporarily
      const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const tempExt = path.extname(imageUrl) || ".jpg"; // keep extension
      const tempPath = `uploads/temp-${Date.now()}${tempExt}`;
      fs.writeFileSync(tempPath, Buffer.from(imageResp.data));

      const formData = new FormData();
      formData.append("file", fs.createReadStream(tempPath));

      flaskResponse = await axios.post("http://127.0.0.1:5001/predict", formData, {
        headers: formData.getHeaders(),
      });

      fs.unlinkSync(tempPath); // delete temp file
    } 
    // If neither file nor URL
    else {
      return res.status(400).json({ error: "No image or URL provided" });
    }

    // Return Flask prediction response
    res.json(flaskResponse.data);
  } catch (error: any) {
    console.error("Error in prediction:", error.message);
    res.status(500).json({ error: "Failed to get prediction" });
  }
});

export default router;
