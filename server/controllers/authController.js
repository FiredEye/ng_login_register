const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../dbConfig");

const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    // Retrieve the users for the specified page
    const result = await pool.query("SELECT * FROM users OFFSET $1 LIMIT $2", [
      offset,
      pageSize,
    ]);
    const data = result.rows;

    // Retrieve the total count of users
    const totalCountResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsersCount = parseInt(totalCountResult.rows[0].count);

    const totalPages = Math.ceil(totalUsersCount / pageSize);
    res.status(200).json({ data, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUsersForChart = async (req, res) => {
  try {
    // Retrieve the users for the specified page
    const result = await pool.query("SELECT * FROM users ");
    const data = result.rows;

    // Retrieve the total count of users
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!uuidPattern.test(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Retrieve the user
    const userDetail = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userDetail.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the user details
    const userDetails = userDetail.rows[0];

    // Respond with the user details
    return res.status(200).json({ userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userRegister = async (req, res) => {
  const { userName, email, password, address, gender, age } = req.body;

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, 12);

    // Insert the new user into the users table
    const insertQuery = `
      INSERT INTO users ( "isAdmin", "loggedInCount", "userName", "email", "password", "address", "imageUrl", "gender", "age")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    await pool.query(insertQuery, [
      false,
      0,
      userName,
      email,
      hash,
      address,
      req.image,
      gender,
      age,
    ]);

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the provided email exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.account === "deActivated") {
      return res
        .status(401)
        .json({ error: "This account has been Deactivated!" });
    }
    // Compare the provided password with the hashed password from the database
    const isPass = await bcrypt.compare(password, user.password);

    if (isPass) {
      await pool.query(
        'UPDATE users SET "loggedInCount" = "loggedInCount" + 1 WHERE id = $1',
        [user.id]
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET
      );

      // Respond with user data and token
      return res.status(201).json({
        email,
        token,
        userName: user.userName,
        isAdmin: user.isAdmin,
        address: user.address,
        gender: user.gender,
        age: user.age,
        loggedInCount: user.loggedInCount + 1,
        imageUrl: user.imageUrl,
      });
    } else {
      return res.status(401).json({ error: "Password does not match" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserDetails = async (req, res, userId) => {
  try {
    const { old_imgPath, ...updateObject } = req.body;

    if (req.image) {
      updateObject.imageUrl = req.image;
    }

    const setClause =
      Object.keys(updateObject)
        .map((key, index) => `"${key}" = $${index + 2}`)
        .join(", ") + ', "updated_at" = current_timestamp';

    const query = `
      UPDATE users
      SET ${setClause}
      WHERE "id" = $1
      RETURNING "email", "userName", "isAdmin", "address", "gender", "age", "imageUrl";
    `;

    const values = [userId, ...Object.values(updateObject)];

    const result = await pool.query(query, values);
    const response = result.rows[0];

    res.status(201).json({
      email: response.email,
      userName: response.userName,
      isAdmin: response.isAdmin,
      address: response.address,
      gender: response.gender,
      age: response.age,
      imageUrl: response.imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json(err);
  }
};

const updateUserDetail = async (req, res) => {
  const { userId } = req;
  await updateUserDetails(req, res, userId);
};

const updateAdminDetail = async (req, res) => {
  const { adminId } = req;
  await updateUserDetails(req, res, adminId);
};

const deactivateUser = async (req, res) => {
  const { userId } = req;
  if (req.params.id !== userId) {
    return res.status(403).json({ error: "Not Authorized!" });
  }
  try {
    if (req.body?.account) {
      const setClause = `"account" = $2, "updated_at" = current_timestamp`;

      const query = `
        UPDATE users
        SET ${setClause}
        WHERE "id" = $1;
      `;

      const values = [userId, "deActivated"];

      await pool.query(query, values);

      return res.status(200).json({ message: "Account deactivated!" });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid request. Please provide account status." });
    }
  } catch (error) {
    console.error("Error deactivating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.params.search;
    if (!searchQuery) {
      return res.status(400).json({
        error: "Invalid search query. Please provide a search string.",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const query = `
      SELECT "id", "userName", "email", "address"
      FROM users
      WHERE LOWER("userName") LIKE LOWER($1)
      OR LOWER("email") LIKE LOWER($1)
      OR LOWER("address") LIKE LOWER($1) LIMIT $2
        OFFSET $3;
    `;

    const countQuery = `
    SELECT COUNT(*) FROM users
    WHERE LOWER("userName") LIKE LOWER($1)
    OR LOWER("email") LIKE LOWER($1)
    OR LOWER("address") LIKE LOWER($1);
  `;

    const values = [`%${searchQuery.toLowerCase()}%`, pageSize, offset];
    const result = await pool.query(query, values);
    const data = result.rows;

    const totalCountResult = await pool.query(countQuery, [
      `%${searchQuery.toLowerCase()}%`,
    ]);
    const totalUsersCount = parseInt(totalCountResult.rows[0].count);

    const totalPages = Math.ceil(totalUsersCount / pageSize);

    return res.status(200).json({ data, totalPages });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUserDetail,
  userRegister,
  userLogin,
  updateUserDetail,
  updateAdminDetail,
  deactivateUser,
  searchUsers,
  getUsersForChart,
};
