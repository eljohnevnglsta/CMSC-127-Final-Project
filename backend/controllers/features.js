import pool from "./pool.js";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/*******************FOOD/ESTABLISHMENT REVIEWS************/
//add food/establishment review
export const addReview = async (req, res) => {
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
    //kada add ng review, dapat nasset na yung averageRating nung food/establishment na ginawan ng review
    if (reviewtype == 2) {
      //for food review
      const updateFoodQuery = `UPDATE food SET averageRating = (select avg(rating) from review where foodcode = ?) WHERE foodcode = ?`;
      await pool.query(updateFoodQuery, [foodcode, foodcode]);
    }
    if (reviewtype == 1) {
      //for establishment review
      const updateFoodQuery = `UPDATE food_establishment SET averageRating = (select avg(rating) from review where businessid = ?) WHERE businessid = ?`;
      await pool.query(updateFoodQuery, [businessid, businessid]);
    }
    res.status(201).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateReview = async (req, res) => {
  const { reviewid, content, rating, username } = req.body;
  const SQLQuery = `UPDATE review SET content = ?, date_updated = curdate(), rating = ? WHERE reviewid = ? AND username = ?`;

  try {
    const response = await pool.query(SQLQuery, [
      content,
      rating,
      reviewid,
      username,
    ]);

    // Get the review type and other attributess
    const reviewtypeQuery = `SELECT reviewtype, foodcode, businessid FROM review WHERE reviewid = ?`;
    const found = await pool.query(reviewtypeQuery, [reviewid]);

    if (found.length === 0) {
      return res.status(404).send("Review not found.");
    }

    const { reviewtype, foodcode, businessid } = found[0];

    if (reviewtype == 2) {
      // For food review
      const updateFoodQuery = `UPDATE food SET averageRating = (SELECT AVG(rating) FROM review WHERE foodcode = ?) WHERE foodcode = ?`;
      await pool.query(updateFoodQuery, [foodcode, foodcode]);
    } else if (reviewtype == 1) {
      // For establishment review
      const updateEstablishmentQuery = `UPDATE food_establishment SET averageRating = (SELECT AVG(rating) FROM review WHERE businessid = ?) WHERE businessid = ?`;
      await pool.query(updateEstablishmentQuery, [businessid, businessid]);
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete food review
export const deleteReview = async (req, res) => {
  const { reviewid, username } = req.body;

  try {
    // Get the review type and other attributess
    const reviewtypeQuery = `SELECT reviewtype, foodcode, businessid FROM review WHERE reviewid = ? AND username = ?`;
    const found = await pool.query(reviewtypeQuery, [reviewid, username]);

    if (found.length === 0) {
      console.log(reviewid);
      console.log(username);
      return res
        .status(404)
        .send(
          "Review not found or you are not authorized to delete this review."
        );
    }

    const { reviewtype, foodcode, businessid } = found[0];

    // Delete the review
    const SQLQuery = `DELETE FROM review WHERE reviewid = ? AND username = ?`;
    const response = await pool.query(SQLQuery, [reviewid, username]);

    if (reviewtype == 2) {
      // For food review
      const updateFoodQuery = `UPDATE food SET averageRating = (SELECT AVG(rating) FROM review WHERE foodcode = ?) WHERE foodcode = ?`;
      await pool.query(updateFoodQuery, [foodcode, foodcode]);
    } else if (reviewtype == 1) {
      // For establishment review
      const updateEstablishmentQuery = `UPDATE food_establishment SET averageRating = (SELECT AVG(rating) FROM review WHERE businessid = ?) WHERE businessid = ?`;
      await pool.query(updateEstablishmentQuery, [businessid, businessid]);
    }

    res.status(200).json(response);
    console.log("success");
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
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
      businessid,
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
  console.log(businessid);
  const SQLQuery = `DELETE FROM food_establishment WHERE businessid = ? `;

  try {
    //delete reviews associated with the food first
    const deleteReviewQuery = `DELETE FROM review WHERE foodcode IN (SELECT foodcode from food where businessid=?)`;
    const deletedReview = await pool.query(deleteReviewQuery, [businessid]);

    //delete food type
    const deleteFoodTypeQuery = `DELETE FROM food_type WHERE foodcode IN (SELECT foodcode from food where businessid=?)`;
    const deletedFoodType = await pool.query(deleteFoodTypeQuery, [businessid]);

    //delete food
    const deleteFoodQuery = `DELETE FROM food WHERE businessid = ?`;
    const deleted = await pool.query(deleteFoodQuery, [businessid]);

    //delete reviews associated with the food_establishment
    const deleteEstQuery = `DELETE FROM review WHERE businessid=?`;
    const deletedEstReview = await pool.query(deleteEstQuery, [businessid]);

    const response = await pool.query(SQLQuery, [businessid]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Search food establishment
export const searchFoodEstablishment = async (req, res) => {
  const SQLQuery = `SELECT * FROM food_establishment WHERE name LIKE ?`;

  try {
    const rows = await pool.query(SQLQuery, [`%${req.body.keyword}%`]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No food establishments found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*******************FOOD ITEMS************/
// Add a food item
export const addFoodItem = async (req, res) => {
  const { name, price, businessid, username, foodtype } = req.body;
  const SQLQuery = `INSERT INTO food (name, price, businessid, username) VALUES (?, ?, ?, ?)`;

  try {
    const response = await pool.query(SQLQuery, [
      name,
      price,
      businessid,
      username,
    ]);
    const foodcode = Number(response.insertId);
    console.log("Inserted foodcode:", foodcode);

    //insert new foodtype
    if (foodtype.length != 0) {
      const insertFoodTypeQuery = `INSERT INTO food_type (foodcode, foodtype) VALUES (?, ?)`;
      for (const type in foodtype) {
        await pool.query(insertFoodTypeQuery, [foodcode, foodtype[type]]);
      }
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a food item
export const updateFoodItem = async (req, res) => {
  const {
    name,
    price,
    foodcode,
    foodtype,
    username,
    isbestseller,
    isspecialty,
  } = req.body;
  const SQLQuery = `UPDATE food SET name = ?,  price = ?, isbestseller=?, isspecialty=? WHERE foodcode = ? and username = ?`;
  console.log(isspecialty);
  try {
    const response = await pool.query(SQLQuery, [
      name,
      price,
      isbestseller,
      isspecialty,
      foodcode,
      username,
    ]);
    //delete old food type
    const deleteFoodType = `DELETE from food_type where foodcode = ?`;
    await pool.query(deleteFoodType, [foodcode]);

    //insert new foodtype
    if (foodtype.length != 0) {
      const insertFoodTypeQuery = `INSERT INTO food_type (foodcode, foodtype) VALUES (?, ?)`;
      for (const type in foodtype) {
        await pool.query(insertFoodTypeQuery, [foodcode, foodtype[type]]);
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

// Delete a food item
export const deleteFoodItem = async (req, res) => {
  const { foodcode } = req.body;
  const SQLQuery = `DELETE FROM food WHERE foodcode = ?`;

  try {
    //Delete reviews associated with the food first
    const deleteReviewQuery = `DELETE FROM review WHERE foodcode=?`;
    const deletedReview = await pool.query(deleteReviewQuery, [foodcode]);

    //Delete associated foodtypes
    const deleteFoodType = `DELETE from food_type where foodcode = ?`;
    await pool.query(deleteFoodType, [foodcode]);

    const response = await pool.query(SQLQuery, [foodcode]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Search food item
export const searchFoodItem = async (req, res) => {
  const { keyword } = req.body;
  const SQLQuery = `SELECT * FROM food WHERE name LIKE ?`;

  try {
    const rows = await pool.query(SQLQuery, [`%${keyword}%`]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
