const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3001;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});
app.delete("/remove", (req, res) => {
  const filePath = req.query.imageUrl;

  fs.unlink(`.${filePath}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(500).json({ error: "Error deleting file" });
    } else {
      res.json({ message: "File deleted successfully" });
    }
  });
});
app.put("/update", upload.single("file"), (req, res) => {
  const filePath = req.body.imageUrl;

  fs.unlink(`.${filePath}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(500).json({ error: "Error deleting file" });
    } else {
      res.json({
        imageUrl: `/uploads/${req.file.filename}`,
      });
    }
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
