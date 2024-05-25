import pool from "./pool.js";

// View all food establishments;
export const viewAllEstablishments = async (req, res) => {
    const SQLQuery = "SELECT * FROM food_establishment;"
    const response = await pool.query(SQLQuery);
    res.status(200).json(response);
}

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

    res.status(200).json(response);
}

// View all food reviews for a food item
// req.body: {foodcode: 00000}
export const viewAllReviewsForFoodItem = async (req, res) => {

    const findQuery = `SELECT foodcode FROM food WHERE foodcode = "${req.body.foodcode}"`;
    const found = await pool.query(findQuery);

    if (found.length == 0) {
        res.status(404).send("Food item not found");
        return;
    }

    const SQLQuery = `SELECT * FROM review WHERE foodcode  = "${req.body.foodcode}";`
    const response = await pool.query(SQLQuery);

    if (response.length == 0) {
        res.status(404).send("No reviews found for this food item");
        return;
    }

    res.status(200).json(response);
}

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
}

// View all food items from an establishment that belong to a food type {meat | veg | etc.};
// req.body: {name: "establishment name", foodtype: "food type"}
export const viewAllFoodItemsForEstablishmentByType = async (req, res) => {
    const findQuery = (`SELECT 
        businessid 
        FROM food_establishment 
        WHERE name = "${req.body.name}"`
    );
    const found = await pool.query(findQuery);

    if (found.length == 0) {
        res.status(404).send("Establishment not found");
        return;
    }

    const SQLQuery = (
        `SELECT f.foodcode, f.name, f.price, t.foodtype 
        FROM food f 
        JOIN food_type t 
        ON f.foodcode = t.foodcode 
        WHERE f.businessid = (${findQuery}) 
        AND t.foodtype = "${req.body.foodtype}"`
    );
    const response = await pool.query(SQLQuery);

    if (response.length == 0) {
        res.status(404).send("No food items found for this category in this establishment");
        return;
    }

    res.status(200).json(response);
}

// View all reviews made within a month for an establishment or a food item;
// req.body: {date: "Month Year" (ex: May 2024), reviewtype: 1 (1 = establishment, 2 = food item)}
export const viewAllReviewsForMonth = async (req, res) => {
    const SQLQuery = (
        `SELECT * FROM review WHERE 
        MONTH(date_added) = MONTH(STR_TO_DATE('${req.body.date}', '%M %Y')) 
        AND YEAR(date_added) = YEAR(STR_TO_DATE('${req.body.date}', '%M %Y')) 
        AND reviewtype = ${req.body.reviewtype};`
    );
    const response = await pool.query(SQLQuery);
    if (response.length == 0) {
        res.status(404).send(`No reviews found for this month`);
        return;
    }

    res.status(200).json(response);
}

//View all establishments with a high average rating (rating>=4). (ratings from 1-5; highest is 5);
export const viewHighlyRatedEstablishments = async (req, res) => {
    const SQLQuery = `SELECT * FROM food_establishment WHERE averageRating >= 4 ORDER BY averageRating DESC;`;
    const response = await pool.query(SQLQuery);
    if (response.length == 0) {
        res.status(404).send(`No highly rated establishments found`);
        return;
    }

    res.status(200).json(response);
}

// View all food items from an establishment arranged according to price;
// req.body: {name: "establishment name"}
export const viewAllFoodItemsForEstablishmentByPrice = async (req, res) => {
    const findQuery = `SELECT businessid FROM food_establishment WHERE name = "${req.body.name}"`;
    const found = await pool.query(findQuery);

    if (found.length == 0) {
        res.status(404).send("Establishment not found");
        return;
    }

    const SQLQuery = (
        `SELECT * FROM food WHERE businessid = (${findQuery}) ORDER BY price ASC;`
    );

    const response = await pool.query(SQLQuery);
    if (response.length == 0) {
        res.status(404).send("No food items found for this establishment");
        return;
    }

    res.status(200).json(response);
}

// Search food items from any establishment based on a given price range and/or food type.
// req.body: {foodtype: "food type", minprice: 0, maxprice: 100}
export const searchFoodItemsByPrice = async (req, res) => {
    const SQLQuery = (
        `SELECT f.* FROM food f 
        JOIN food_type t 
        ON f.foodcode = t.foodcode 
        WHERE (f.price BETWEEN ${req.body.minprice} AND ${req.body.maxprice}) 
        AND t.foodtype= "${req.body.foodtype}";`
    );

    const response = await pool.query(SQLQuery);
    if (response.length == 0) {
        res.status(404).send("No food items found for this category in this price range");
        return;
    }

    res.status(200).json(response);
}