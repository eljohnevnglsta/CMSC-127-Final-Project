import pool from "./pool.js";

// View all food establishments;
export const viewAllEstablishments = async (req, res) => {
  const SQLQuery = "SELECT * FROM food_establishment;";
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};

// View all food reviews for an establishment
// req.body: {name: "establishment name"}
export const viewAllReviewsForEstablishment = async (req, res) => {
  const findQuery = `SELECT businessid FROM food_establishment WHERE name = "${req.body.name}"`;

  const found = await pool.query(findQuery);
  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT * FROM review WHERE businessid = (${findQuery});`;
  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res.status(404).send("No reviews found for this establishment");
    return;
  }
  console.log(response);
  res.status(200).json(response);
};

// View all food reviews for a food item
// req.body: {foodcode: 00000}
export const viewAllReviewsForFoodItem = async (req, res) => {
  const findQuery = `SELECT foodcode FROM food WHERE foodcode = "${req.body.foodcode}"`;
  const found = await pool.query(findQuery);

  if (found.length == 0) {
    res.status(404).send("Food item not found");
    return;
  }

  const SQLQuery = `SELECT * FROM review WHERE foodcode  = "${req.body.foodcode}";`;
  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res.status(404).send("No reviews found for this food item");
    return;
  }

  res.status(200).json(response);
};

// View all food items from an establishment;
// req.body: {name: "establishment name"}
export const viewAllFoodItemsForEstablishment = async (req, res) => {
  const findQuery = `SELECT businessid FROM food_establishment WHERE name = "${req.body.name}"`;
  const found = await pool.query(findQuery);
  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT * FROM food WHERE businessid = (${findQuery});`;
  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res.status(404).send("No food items found for this establishment");
    return;
  }

  res.status(200).json(response);
};

// View all food items from an establishment that belong to a food type {meat | veg | etc.};
// req.body: {name: "establishment name", foodtype: "food type"}
export const viewAllFoodItemsForEstablishmentByType = async (req, res) => {
  const findQuery = `SELECT 
        businessid 
        FROM food_establishment 
        WHERE name = "${req.body.name}"`;
  const found = await pool.query(findQuery);

  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT f.foodcode, f.name, f.price, t.foodtype, f.averageRating
        FROM food f 
        JOIN food_type t 
        ON f.foodcode = t.foodcode 
        WHERE f.businessid = (${findQuery}) 
        AND t.foodtype = "${req.body.foodtype}" ORDER BY f.price ${req.body.order}`;
  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res
      .status(404)
      .send("No food items found for this category in this establishment");
    return;
  }

  res.status(200).json(response);
};

// View all reviews made within a month for an establishment or a food item;
// req.body: {date: "Month Year" (ex: May 2024), reviewtype: 1 (1 = establishment, 2 = food item)}
export const viewAllReviewsForMonth = async (req, res) => {
  const findQuery = `SELECT 
        businessid 
        FROM food_establishment 
        WHERE name = "${req.body.name}"`;
  const found = await pool.query(findQuery);

  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT * FROM review WHERE 
        MONTH(date_added) = MONTH(STR_TO_DATE('${req.body.date}', '%Y-%m-%d')) 
        AND YEAR(date_added) = YEAR(STR_TO_DATE('${req.body.date}', '%Y-%m-%d')) 
        AND businessid = (${findQuery}) ;`;
  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send(`No reviews found for this month`);
    return;
  }

  res.status(200).json(response);
};

export const viewAllReviewsForFoodMonth = async (req, res) => {
  const SQLQuery = `SELECT * FROM review WHERE 
        MONTH(date_added) = MONTH(STR_TO_DATE('${req.body.date}', '%Y-%m-%d')) 
        AND YEAR(date_added) = YEAR(STR_TO_DATE('${req.body.date}', '%Y-%m-%d')) 
        AND foodcode = (${req.body.foodcode}) ;`;
  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send(`No reviews found for this month`);
    return;
  }

  res.status(200).json(response);
};
//View all establishments with a high average rating (rating>=4). (ratings from 1-5; highest is 5);
export const viewHighlyRatedEstablishments = async (req, res) => {
  const SQLQuery = `SELECT * FROM food_establishment WHERE averageRating >= 4 ORDER BY averageRating DESC;`;
  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send(`No highly rated establishments found`);
    return;
  }

  res.status(200).json(response);
};

// View all food items from an establishment arranged according to price;
// req.body: {name: "establishment name"}
export const viewAllFoodItemsForEstablishmentByPrice = async (req, res) => {
  const findQuery = `SELECT businessid FROM food_establishment WHERE name = "${req.body.name}"`;
  const found = await pool.query(findQuery);
  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT * FROM food WHERE businessid = (${findQuery}) ORDER BY price ${req.body.order};`;

  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send("No food items found for this establishment");
    return;
  }

  res.status(200).json(response);
};

// Search food items from any establishment based on a given price range and/or food type.
// req.body: {minprice: 0, maxprice: 100}
export const searchFoodItemsByPrice = async (req, res) => {
  const SQLQuery = `SELECT f.* FROM food f 
        JOIN food_type t 
        ON f.foodcode = t.foodcode 
        WHERE (f.price BETWEEN ${req.body.minprice} AND ${req.body.maxprice});`;

  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res
      .status(404)
      .send("No food items found for this category in this price range");
    return;
  }

  res.status(200).json(response);
};

// Search food items from any establishment based on food type.
// req.body: {foodtype: "food type"}
export const searchFoodItemsByType = async (req, res) => {
  const SQLQuery = (`SELECT f.*
        FROM food f
        JOIN food_type ft ON f.foodcode = ft.foodcode
        WHERE ft.foodtype = '${req.body.foodtype}';`
    );
    console.log(SQLQuery)
    const response = await pool.query(SQLQuery);
    console.log(response)
    if (response.length == 0) {
        res.status(404).send("No food items found for this category");
        return;
    }
    
    res.status(200).json(response);
}

export const searchFoodItemsByFilters = async (req, res) => {
    const { minprice, maxprice, foodtype } = req.body;

    let SQLQuery = `SELECT f.* FROM food f JOIN food_type ft ON f.foodcode = ft.foodcode WHERE `;
    let queryParams = [];

    if (foodtype) {
        SQLQuery += `ft.foodtype = ?`;
        queryParams.push(foodtype);
    }

    if (minprice != null && maxprice != null) {
        if (foodtype) {
            SQLQuery += ` AND `;
        }
        SQLQuery += `(f.price BETWEEN ? AND ?)`;
        queryParams.push(minprice, maxprice);
    }

    if (!foodtype && (minprice == null || maxprice == null)) {
        res.status(400).send("Either foodtype or both minprice and maxprice must be provided");
        return;
    }

    try {
        const response = await pool.query(SQLQuery, queryParams);
        if (response.length == 0) {
            res.status(404).send("No food items found for this category in this price range");
            return;
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


export const selectType = async (req, res) => {
  const SQLQuery = "SELECT DISTINCT foodtype FROM food_type;";
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};

export const selectBusinessOfFood = async (req, res) => {
  const findQuery = `SELECT businessid FROM food WHERE foodcode = "${req.body.foodcode}"`;
  const found = await pool.query(findQuery);
  if (found.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  const SQLQuery = `SELECT * FROM food_establishment WHERE businessid = (${findQuery});`;

  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send("No food items found for this establishment");
    return;
  }

  res.status(200).json(response);
};

// export const selectOneFood = async (req, res) => {
//     const SQLQuery = `SELECT x.*, t.foodtype FROM food_type t JOIN (SELECT f.*,b.name AS est FROM food f JOIN food_establishment b ON f.businessid = b.businessid)x ON t.foodcode = x.foodcode WHERE x.foodcode = ${req.body.foodcode}`;
//     const response = await pool.query(SQLQuery);
//     res.status(200).json(response);
// }

export const selectOneFood = async (req, res) => {
  const foodcode = req.body.foodcode;
  const SQLQuery = `
        SELECT x.*, t.foodtype 
        FROM food_type t 
        JOIN (
            SELECT f.*, b.name AS est 
            FROM food f 
            JOIN food_establishment b 
            ON f.businessid = b.businessid
        ) x 
        ON t.foodcode = x.foodcode 
        WHERE x.foodcode = ${foodcode}
    `;
  try {
    const response = await pool.query(SQLQuery);
    console.log(response);
    // Transform the result to aggregate foodtype into an array
    if (response.length > 0) {
      const result = {
        ...response[0],
        foodtype: response.map((row) => row.foodtype),
      };
      res.status(200).json(result);
    } else {
      SQLQuery = `Select * f`;
      res.status(404).json({ message: "Food not found" });
    }
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBusinessId = async (req, res) => {
  var SQLQuery = ``;
  if (req.body.searchCriteria == "name") {
    SQLQuery = `SELECT * FROM food_establishment WHERE name = "${req.body.name}"`;
  } else {
    SQLQuery = `SELECT * FROM food_establishment WHERE businessid = ${req.body.businessid}`;
  }

  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res.status(404).send("Establishment not found");
    return;
  }

  res.status(200).json(response);
};

// Find food item by name or food code;
// req.body: {name: "food name", businessid: XXXXX, searchCriteria: "name"}
// req.body: {foodcode: "food code", searchCriteria: "foodcode"}
export const getFoodCode = async (req, res) => {
  var SQLQuery = ``;

  if (req.body.searchCriteria == "name") {
    SQLQuery = `SELECT * FROM food WHERE name = "${req.body.name}" and businessid = ${req.body.businessid}`;
  } else {
    SQLQuery = `SELECT * FROM food WHERE foodcode = "${req.body.foodcode}"`;
  }

  const response = await pool.query(SQLQuery);

  if (response.length == 0) {
    res.status(404).send("Food item not found");
    return;
  }

  res.status(200).json(response);
};

export const viewAllReviews = async (req, res) => {
  const SQLQuery = `SELECT * FROM review;`;
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};

export const getReview = async (req, res) => {
  const SQLQuery = `SELECT * FROM review WHERE reviewid = ${req.body.reviewid};`;
  const response = await pool.query(SQLQuery);
  if (response.length == 0) {
    res.status(404).send("Review not found");
    return;
  }
  res.status(200).json(response);
};

export const viewAllEstablishmentsForManager = async (req, res) => {
  const SQLQuery = `SELECT * FROM food_establishment WHERE username = "${req.params.username}";`;
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};

export const selectEstablishmentDetails = async (req, res) => {
  const SQLQuery = `SELECT * FROM food_establishment WHERE name = "${req.params.name}";`;
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};

export const selectAllFood = async (req, res) => {
  const SQLQuery = "SELECT * FROM food";
  const response = await pool.query(SQLQuery);
  res.status(200).json(response);
};
