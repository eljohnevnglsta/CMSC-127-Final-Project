import pool from "./pool.js";

//this acts as middleware/restrictor so that any invalid/unauthorized usertype cannot access the routes/backend features
export const checkUserType = (requiredUserType) => {
  return async (req, res, next) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const SQLQuery = `SELECT usertype FROM user WHERE username = ?`;

    try {
      const [rows] = await pool.query(SQLQuery, [username]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (rows.usertype !== requiredUserType) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient user privileges" });
      }

      next();
    } catch (error) {
      console.error("Database query error:", error.message);
      res.status(500).send(error.message);
    }
  };
};
