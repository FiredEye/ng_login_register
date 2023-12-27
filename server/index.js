const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  fileUpload({
    limits: { fileSize: 15 * 1024 * 1024 },
    abortOnLimit: true,
  })
);
app.get("/", (req, res) => {
  res.status(200).json({ message: "it works!" });
});
app.use(authRoutes);
app.use((req, res) => {
  res.status(404).json("not found");
});

app.listen(5000, () => {
  console.log("server running");
});
