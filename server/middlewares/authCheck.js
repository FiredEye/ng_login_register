const jwt = require("jsonwebtoken");
const pool = require("../dbConfig");
const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(404).json("not authorized");
  const decode = jwt.decode(token, process.env.JWT_SECRET);
  if (!decode) return res.status(404).json("not authorized");
  const { isAdmin, id } = decode;

  if (!isAdmin) return res.status(404).json("not authorized");
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    // Assuming your user data is in the first row of the result
    const user = result.rows[0];

    req.adminId = user.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json("not authorized");
  const decode = jwt.decode(token, process.env.JWT_SECRET);
  if (!decode) return res.status(403).json("not authorized");
  const { id } = decode;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming your user data is in the first row of the result
    const user = result.rows[0];

    req.userId = user.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { checkAdmin, checkUser };
