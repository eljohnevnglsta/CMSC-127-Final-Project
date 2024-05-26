import pool from "./pool.js";

export const checkUserType = (requiredUserType) => {
  return async (req, res, next) => {
    const { username } = req.body;
    const SQLQuery = `SELECT usertype FROM user WHERE username = ?`;

    try {
      const [rows] = await pool.query(SQLQuery, [username]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userType = rows[0].usertype;

      if (userType !== requiredUserType) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient user privileges" });
      }

      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
};
