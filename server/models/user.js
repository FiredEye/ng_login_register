async function insertDataFromExternalFile() {
  try {
    const client = await pool.connect();

    // Read the external JSON file
    const jsonData = JSON.parse(fs.readFileSync("./db.json", "utf8"));

    // Loop through the JSON data and insert each object into the users table
    for (const user of jsonData) {
      const hashPassword = await bcrypt.hash(user.password, 12);
      const query = `
            INSERT INTO users (
              "isAdmin", "loggedInCount", "userName", "email", "password", "address", "imageUrl", "gender", "age"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `;

      const values = [
        user.isAdmin,
        user.loggedInCount,
        user.userName,
        user.email,
        hashPassword,
        user.address,
        user.imageUrl,
        user.gender,
        user.age,
      ];

      await client.query(query, values);
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await pool.end();
  }
}

// Call the function to insert data from the external JSON file
// insertDataFromExternalFile();
