const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const pool = require("../dbConfig");

const handleFileUpload = (req, res, next, uploadPath, fieldName) => {
  try {
    if (req.files && req.files[fieldName]) {
      const file = req.files[fieldName];

      const extTypes = [".jpg", ".jpeg", ".png"];
      if (extTypes.includes(path.extname(file.name))) {
        const fileName = uuidv4() + path.extname(file.name);
        const destinationPath = `./uploads/${uploadPath}/${fileName}`;

        file.mv(destinationPath, (err) => {
          if (err) {
            console.error(`Error moving file: ${err}`);
            return res
              .status(400)
              .json({ error: "Failed to save image on the server!" });
          } else {
            req.image = `/uploads/${uploadPath}/${fileName}`;
            return next();
          }
        });
      } else {
        return res.status(400).json({ error: "Invalid image file type" });
      }
    } else {
      return res.status(400).json({ error: "Image file not given" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(`${err}`);
  }
};

const addProfileFile = async (req, res, next) => {
  try {
    const { password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) {
      return res.status(403).json({ error: "Password does not match" });
    }

    // Check if the email already exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const isExist = result.rows.length > 0;

    if (isExist) {
      return res.status(403).json({ error: "Email already exists" });
    }

    handleFileUpload(req, res, next, "profiles", "imageFile");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleFileUpdate = (req, res, next, uploadPath, fieldName) => {
  try {
    if (req.files && req.files[fieldName]) {
      const file = req.files[fieldName];
      fs.unlink(`.${req.body?.old_imgPath}`, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return res.status(401).json("Error updating image");
        }
      });
      const extTypes = [".jpg", ".jpeg", ".png"];
      if (extTypes.includes(path.extname(file.name))) {
        const fileName = uuidv4() + path.extname(file.name);
        const destinationPath = `./uploads/${uploadPath}/${fileName}`;

        file.mv(destinationPath, (err) => {
          if (err) {
            console.error(`Error moving file: ${err}`);
            return res.status(400).json("Failed to save image on the server!");
          } else {
            req.image = `/uploads/${uploadPath}/${fileName}`;
            return next();
          }
        });
      } else {
        return res.status(400).json("Please provide a valid image");
      }
    } else {
      return next();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(`${err}`);
  }
};

const updateProfileFile = (req, res, next) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ error: "Not Authorized!" });
  }
  handleFileUpdate(req, res, next, "profiles", "imageFile");
};

const deleteFile = (req, res, next) => {
  try {
    if (req.body?.old_productImg) {
      fs.unlink(`.${req.body?.old_productImg}`, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return res.status(401).json("Error Deleting Image");
        } else {
          // console.log("File deleted successfully");
          return next();
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(`${err}`);
  }
};
module.exports = {
  addProfileFile,
  updateProfileFile,
  deleteFile,
};
