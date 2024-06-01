import pool from "./pool.js";
export const logIn = async (req, res) => {
  const { username, accesskey } = req.body;

  const SQLQuery = `SELECT accesskey FROM user WHERE username = "${username}"`;
  const found = await pool.query(SQLQuery);
  if (found.length == 0) {
    res.json({ success: false, message: "Invalid username" });
    return;
  }
  if (found[0].accesskey === accesskey) {
    const query = `SELECT usertype FROM user WHERE username = "${username}"`;
    const user = await pool.query(query);
    res.json({ success: true, usertype: user[0].usertype, username: username });
  } else {
    res.json({ success: false, message: "Incorrect accesskey" });
  }
};
