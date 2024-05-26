/*******************FOOD REVIEWS************/
// Add a food review
import pool from "./pool.js";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

//add food review
export const addFoodReview = async (req, res) => {
  const { content, reviewtype, rating, username, businessid, foodcode } =
    req.body;
  const SQLQuery = `INSERT INTO review (content, reviewtype, date_added, rating, username, businessid, foodcode) VALUES (?, ?, curdate(), ?, ?, ?, ?)`;

  try {
    const response = await pool.query(SQLQuery, [
      content,
      reviewtype,
      rating,
      username,
      businessid,
      foodcode,
    ]);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//update food review
export const updateFoodReview = async (req, res) => {
  const { reviewid, content, rating, username } = req.body;
  const SQLQuery = `UPDATE review SET content = ?,  date_updated = curdate(), rating = ?  WHERE reviewid = ? and username = ? `;

  try {
    const response = await pool.query(SQLQuery, [
      content,
      rating,
      username,
      reviewid,
    ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
//delete food review
export const deleteFoodReview = async (req, res) => {
  const { reviewid, username } = req.body;
  const SQLQuery = `DELETE FROM review WHERE reviewid = ? and username = ?`;

  try {
    const response = await pool.query(SQLQuery, [reviewid, username]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*******************FOOD ESTABLISHMENT************/
//add food establishment
export const addFoodEstablishment = async (req, res) => {
  const { name, type, street, barangay, city, province, username } = req.body;
  const SQLQuery = `INSERT INTO food_establishment (name, type, street, barangay, city, province, username) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    const response = await pool.query(SQLQuery, [
      name,
      type,
      street,
      barangay,
      city,
      province,
      username,
    ]);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
//update food establishment
export const updateFoodEstablishment = async (req, res) => {
  const {
    businessid,
    name,
    type,
    averageRating,
    street,
    barangay,
    city,
    province,
    username,
  } = req.body;
  const SQLQuery = `UPDATE food_establishment SET name = ?, type = ?, averageRating = (select avg(rating) from review where businessid=?), street = ?, barangay = ?, city = ?, province = ?, username = ? WHERE businessid = ?`;

  try {
    const response = await pool.query(SQLQuery, [
      name,
      type,
      averageRating,
      street,
      barangay,
      city,
      province,
      username,
      businessid,
    ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete food establishment
export const deleteFoodEstablishment = async (req, res) => {
  const { businessid } = req.body;
  const SQLQuery = `DELETE FROM food_establishment WHERE businessid = ?`;

  try {
    const response = await pool.query(SQLQuery, [businessid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
