CREATE OR REPLACE USER 'dev'@'localhost' IDENTIFIED BY 'pass';
DROP DATABASE IF EXISTS `project`;
CREATE DATABASE IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `project`;
GRANT ALL ON project.* TO 'dev'@'localhost';

CREATE TABLE user (
	username VARCHAR(20),
	firstname VARCHAR(20) NOT NULL,
	lastname VARCHAR(20) NOT NULL,
	usertype INT(1) NOT NULL,
	accesskey VARCHAR(8),
	CONSTRAINT user_username_pk PRIMARY KEY (username),
	CONSTRAINT user_accesskey_uk UNIQUE (accesskey)
);

CREATE TABLE food_establishment(
	businessid INT(5) AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	type VARCHAR(15) NOT NULL,
	averageRating DECIMAL(5,4),
	street VARCHAR(20) NOT NULL,
	barangay VARCHAR(20) NOT NULL,
	city VARCHAR(20) NOT NULL,
	province VARCHAR(20) NOT NULL,
	username VARCHAR(20) NOT NULL,
	CONSTRAINT food_establishment_businessid_pk PRIMARY KEY (businessid),
	CONSTRAINT food_establishment_username_fk FOREIGN KEY(username) REFERENCES user(username)
);

-- Food Table:
CREATE TABLE food(
	foodcode INT(5) AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	isspecialty BOOLEAN DEFAULT FALSE,
	isbestseller BOOLEAN DEFAULT FALSE,
averageRating DECIMAL(5,4),
	username VARCHAR(20) NOT NULL,
	businessid INT(5) NOT NULL,
	CONSTRAINT food_foodcode_pk PRIMARY KEY (foodcode),
	CONSTRAINT food_username_fk FOREIGN KEY (username) REFERENCES user(username),
	CONSTRAINT food_businessid_fk FOREIGN KEY(businessid) REFERENCES food_establishment(businessid)
);

-- Food Type Table:
CREATE TABLE food_type(
	foodcode INT(5) AUTO_INCREMENT,
	foodtype VARCHAR(15),
	CONSTRAINT food_type_foodcode_foodtype_pk PRIMARY KEY (foodcode, foodtype)
);

-- Review Table:
CREATE TABLE review(
	reviewid INT(5) AUTO_INCREMENT,
	content VARCHAR(300),
	reviewtype INT(1),
	date_added datetime NOT NULL,
	date_updated datetime,
	rating INT(1) NOT NULL,
	username VARCHAR (20) NOT NULL,
	businessid INT(5),
	foodcode INT(5),
	CONSTRAINT review_reviewid_pk PRIMARY KEY (reviewid),
	CONSTRAINT review_username_fk FOREIGN KEY(username) REFERENCES user(username),
	CONSTRAINT review_businessid_fk FOREIGN KEY(businessid) REFERENCES food_establishment(businessid),
	CONSTRAINT review_foodcode_fk FOREIGN KEY(foodcode) REFERENCES food(foodcode)
);

-- Populate the user table
INSERT INTO user (username, firstname, lastname, usertype, accesskey) VALUES
('lauraking', 'Laura', 'King', 0, 'A6Z7A8B9'),  -- admin user
('mikewhite', 'Mike', 'White', 2, 'M8R9S0T1'),  -- manager users
('sarablack', 'Sara', 'Black', 2, 'M2V3W4X5'),
('tinahill', 'Tina', 'Hill', 2, 'M1A2B3C4'),
('samparker', 'Sam', 'Parker', 2, 'M5E6F7G8'),
('elizathompson', 'Eliza', 'Thompson', 2, 'M9I0J1K2'),
('johndoe', 'John', 'Doe', 1, 'U1B2C3D4'),  -- regular users
('janesmith', 'Jane', 'Smith', 1, 'U5F6G7H8'),
('alicejohnson', 'Alice', 'Johnson', 1, 'U9J1K2L3'),
('bobbrown', 'Bob', 'Brown', 1, 'U4N5O6P7'),
('emilyclark', 'Emily', 'Clark', 1, 'U8Q9R0S1'),
('davidlewis', 'David', 'Lewis', 1, 'U2U3V4W5'),
('sophiamartinez', 'Sophia', 'Martinez', 1, 'U6Y7Z8A9'),
('danielgarcia', 'Daniel', 'Garcia', 1, 'U0C1D2E3'),
('miarodriguez', 'Mia', 'Rodriguez', 1, 'U4G5H6I7'),
('jameslee', 'James', 'Lee', 1, 'U8K9L0M1');

-- Populate the food_establishment table
INSERT INTO food_establishment (name, type, street, barangay, city, province, username) VALUES
('Deli Delight', 'Deli', '10 Elm St', 'Barangay 5', 'City E', 'Province Y', 'mikewhite'),
('Pasta Paradise', 'Italian', '20 Oak Ave', 'Barangay 6', 'City F', 'Province Z', 'mikewhite'),
('Grill Galore', 'BBQ', '30 Maple St', 'Barangay 7', 'City G', 'Province X', 'sarablack'),
('Noodle Nest', 'Chinese', '40 Pine Ave', 'Barangay 8', 'City H', 'Province W', 'sarablack'),
('Salad Stop', 'Healthy', '50 Birch St', 'Barangay 9', 'City I', 'Province V', 'tinahill'),
('Curry Corner', 'Indian', '60 Cedar Ave', 'Barangay 10', 'City J', 'Province U', 'tinahill'),
('Pizza Palace', 'Pizza', '70 Spruce St', 'Barangay 11', 'City K', 'Province T', 'samparker'),
('Burger Bistro', 'Burger', '80 Walnut Ave', 'Barangay 12', 'City L', 'Province S', 'samparker'),
('Sushi Spot', 'Sushi', '90 Elm St', 'Barangay 13', 'City M', 'Province R', 'elizathompson'),
('Taco Tavern', 'Mexican', '100 Oak Ave', 'Barangay 14', 'City N', 'Province Q', 'elizathompson');

INSERT INTO food (name, price, isspecialty, isbestseller, username, businessid)
VALUES
    -- Foods for 'mikewhite' (Mike White)
    ('Ham and Cheese Sandwich', 8.50, TRUE, FALSE, 'mikewhite', 1),
    ('Spaghetti Carbonara', 12.99, FALSE, TRUE, 'mikewhite', 1),
    ('Grilled Chicken Salad', 9.75, TRUE, FALSE, 'mikewhite', 1),
    ('Mushroom Risotto', 14.50, FALSE, FALSE, 'mikewhite', 1),
    ('Chicken Alfredo Pizza', 10.99, FALSE, TRUE, 'mikewhite', 2),
    ('Bacon Cheeseburger', 11.25, TRUE, FALSE, 'mikewhite', 2),
    ('Caesar Salad', 7.99, TRUE, FALSE, 'mikewhite', 2),
    ('Margherita Pizza', 9.50, FALSE, TRUE, 'mikewhite', 2),
    ('Chicken Quesadilla', 8.75, FALSE, FALSE, 'mikewhite', 2),
    ('Caprese Salad', 6.99, TRUE, FALSE, 'mikewhite', 2),

    -- Foods for 'sarablack' (Sara Black)
    ('BBQ Pork Ribs', 16.99, TRUE, FALSE, 'sarablack', 3),
    ('Sweet and Sour Chicken', 12.50, FALSE, TRUE, 'sarablack', 3),
    ('Beef Chow Mein', 11.75, TRUE, FALSE, 'sarablack', 3),
    ('Shrimp Fried Rice', 13.25, FALSE, FALSE, 'sarablack', 3),
    ('Orange Chicken', 9.99, FALSE, TRUE, 'sarablack', 4),
    ('Vegetable Lo Mein', 8.50, TRUE, FALSE, 'sarablack', 4),
    ('General Tso''s Chicken', 10.75, TRUE, FALSE, 'sarablack', 4),
    ('Beef and Broccoli', 12.25, FALSE, TRUE, 'sarablack', 4),
    ('Egg Drop Soup', 5.99, FALSE, FALSE, 'sarablack', 4),
    ('Hot and Sour Soup', 5.99, TRUE, FALSE, 'sarablack', 4),

    -- Foods for 'tinahill' (Tina Hill)
    ('Grilled Steak', 18.50, TRUE, FALSE, 'tinahill', 5),
    ('Grilled Salmon', 16.75, FALSE, TRUE, 'tinahill', 5),
    ('Chicken Caesar Wrap', 10.99, TRUE, FALSE, 'tinahill', 5),
    ('Vegetable Stir Fry', 12.25, FALSE, FALSE, 'tinahill', 5),
    ('Grilled Veggie Skewers', 9.99, TRUE, FALSE, 'tinahill', 6),
    ('Shrimp Scampi', 15.50, FALSE, TRUE, 'tinahill', 6),
    ('Lemon Herb Chicken', 13.75, TRUE, FALSE, 'tinahill', 6),
    ('Cajun Blackened Tilapia', 14.99, FALSE, TRUE, 'tinahill', 6),
    ('Classic Caesar Salad', 8.50, FALSE, FALSE, 'tinahill', 6),
    ('Greek Salad', 9.25, TRUE, FALSE, 'tinahill', 6),
	
	-- Foods for samparker
	('Pepperoni Pizza', 11.99, TRUE, FALSE, 'samparker', 7),
    ('Cheeseburger', 9.50, FALSE, TRUE, 'samparker', 7),
    ('California Roll', 13.50, TRUE, FALSE, 'samparker', 8),
    ('Taco', 4.99, FALSE, TRUE, 'samparker', 8),

	-- Foods for elizathompson
    ('Margherita Pizza', 10.50, TRUE, FALSE, 'elizathompson', 9),
    ('Bacon Cheeseburger', 12.75, FALSE, TRUE, 'elizathompson', 9),
    ('Sashimi Platter', 18.99, TRUE, FALSE, 'elizathompson', 10),
    ('Beef Teriyaki', 15.50, FALSE, TRUE, 'elizathompson', 10);

-- Populate the food_type table
INSERT INTO food_type (foodcode, foodtype)
VALUES
    -- Food types for 'mikewhite' foods
    (1, 'Sandwich'),
    (1, 'Deli'),
    (2, 'Pasta'),
    (2, 'Italian'),
    (3, 'Salad'),
    (3, 'Grilled'),
    (4, 'Risotto'),
    (5, 'Pizza'),
    (5, 'Italian'),
    (6, 'Burger'),
    (6, 'American'),
    (7, 'Salad'),
    (7, 'Italian'),
    (8, 'Pizza'),
    (8, 'Italian'),
    (9, 'Mexican'),
    (9, 'Chicken'),
    (10, 'Salad'),
    (10, 'Italian'),

    -- Food types for 'sarablack' foods
    (11, 'BBQ'),
    (11, 'Pork'),
    (12, 'Chicken'),
    (12, 'Asian'),
    (13, 'Beef'),
    (13, 'Chinese'),
    (14, 'Seafood'),
    (14, 'Rice'),
    (15, 'Chicken'),
    (15, 'Asian'),
    (16, 'Vegetable'),
    (16, 'Healthy'),
    (17, 'Grilled'),
    (17, 'Steak'),
    (18, 'Grilled'),
    (18, 'Seafood'),
    (19, 'Wrap'),
    (19, 'Chicken'),
    (20, 'Stir Fry'),
    (20, 'Vegetable'),

    -- Food types for 'tinahill' foods
    (21, 'Grilled'),
    (21, 'Steak'),
    (22, 'Grilled'),
    (22, 'Seafood'),
    (23, 'Wrap'),
    (23, 'Chicken'),
    (24, 'Stir Fry'),
    (24, 'Vegetable'),
    (25, 'Grilled'),
    (25, 'Vegetable'),
    (26, 'Seafood'),
    (26, 'Shrimp'),
    (27, 'Chicken'),
    (27, 'Herb'),
    (28, 'Fish'),
    (28, 'Cajun'),
    (29, 'Salad'),
    (29, 'Caesar'),
    (30, 'Salad'),
    (30, 'Greek'),
	
	-- Food types for 'samparker' foods
	(31, 'Pizza'),
    (31, 'Italian'),
    (32, 'Burger'),
    (32, 'American'),
    (33, 'Sushi'),
    (33, 'Japanese'),
    (34, 'Mexican'),
    (34, 'Taco'),
    (35, 'Pizza'),
    (35, 'Italian'),
    (36, 'Burger'),
    (36, 'Bacon'),
    (37, 'Sushi'),
    (37, 'Japanese'),
    (38, 'Beef'),
    (38, 'Japanese');
   

-- Populate the review table
INSERT INTO review (content, reviewtype, date_added, rating, username, businessid, foodcode)
VALUES
    -- Reviews for establishments
    ('Great ambiance and friendly staff!', 1, '2024-06-03 10:00:00', 5, 'johndoe', 1, NULL),
    ('Delicious food and cozy atmosphere.', 1, '2024-06-03 11:00:00', 4, 'janesmith', 2, NULL),
    ('Excellent service and clean environment.', 1, '2024-05-03 12:00:00', 5, 'alicejohnson', 3, NULL),
    ('Amazing noodles and quick service!', 1, '2024-05-03 13:00:00', 5, 'bobbrown', 4, NULL),
    ('The best salad in town!', 1, '2024-04-03 14:00:00', 4, 'emilyclark', 5, NULL),
    ('Lovely decor and friendly staff.', 1, '2024-04-03 15:00:00', 5, 'davidlewis', 6, NULL),
    ('Great selection of pizza!', 1, '2024-03-03 16:00:00', 4, 'sophiamartinez', 7, NULL),
    ('Tender meat and great atmosphere.', 1, '2024-03-03 17:00:00', 5, 'danielgarcia', 8, NULL),
    ('Authentic sushi pasta!', 1, '2024-05-03 18:00:00', 4, 'miarodriguez', 9, NULL),
    ('Fresh Taco and healthy options.', 1, '2024-05-03 19:00:00', 5, 'jameslee', 10, NULL),

    -- Reviews for foods
    ('The ham sandwich was delicious!', 2, '2024-06-03 10:30:00', 5, 'johndoe', NULL, 1),
    ('Perfectly cooked Chicken Alfredo Pizza.', 2, '2024-06-03 11:30:00', 4, 'janesmith', NULL, 5),
    ('Juicy BBQ Pork Ribs, loved it!', 2, '2024-05-03 12:30:00', 4, 'alicejohnson', NULL, 11),
    ('Fresh and tasty Orange Chicken.', 2, '2024-05-03 13:30:00', 5, 'bobbrown', NULL, 15),
    ('Delicious Grilled Steak with sauce.', 2, '2024-04-03 14:30:00', 4, 'emilyclark', NULL, 21),
    ('The GVS was amazing!', 2, '2024-04-03 15:30:00', 5, 'davidlewis', NULL, 25),
    ('Satisfying beef pepperoni pizza.', 2, '2024-03-03 16:30:00', 4, 'sophiamartinez', NULL, 31),
    ('The California Roll were finger-licking good!', 2, '2024-03-03 17:30:00', 5, 'danielgarcia', NULL, 33),
    ('Loved the Margherita Pizza, very flavorful.', 2, '2024-02-03 18:30:00', 4, 'miarodriguez', NULL, 35),
    ('Fresh and crisp Sashimi Platter.', 2, '2024-02-03 19:30:00', 5, 'jameslee', NULL, 37),

    -- Additional reviews for establishments
    ('Nice place to hang out with friends.', 1, '2024-06-04 10:00:00', 4, 'jameslee', 1, NULL),
    ('I did not like it much.', 1, '2024-03-04 10:00:00', 1, 'emilyclark', 1, NULL),
    ('The service was not great but we were able to enjoy the food.', 1, '2023-01-04 10:00:00', 1, 'bobbrown', 1, NULL),
    ('Crews need to be nicer', 2, '2023-03-24 10:00:00', 1, 'janesmith', 1, NULL),
    ('Good food, will definitely come back.', 1, '2024-06-04 11:00:00', 5, 'janesmith', 2, NULL),

    -- Additional reviews for foods
    ('The sandwich was okay, nothing special.', 2, '2024-06-04 10:30:00', 3, 'alicejohnson', NULL, 1),
    ('The sandwich was great. It reminded of the one my mom used to make', 2, '2024-02-04 10:30:00', 5, 'emilyclark', NULL, 1),
    ('The sandwich was awful. The lettuce was not fresh', 2, '2024-02-24 10:30:00', 2, 'johndoe', NULL, 1),
    ('Parang maalat yung sandwich na binigay sa amin eh', 2, '2023-02-14 10:30:00', 1, 'bobbrown', NULL, 1),
    ('The pizza was a bit too greasy for my taste.', 2, '2024-06-04 11:30:00', 3, 'bobbrown', NULL, 5);


UPDATE food f JOIN (
	SELECT 
        foodcode, 
        AVG(rating) AS avg_rating
    FROM 
        review
    WHERE 
        foodcode IS NOT NULL
    GROUP BY 
        foodcode
) r ON f.foodcode = r.foodcode
SET 
    f.averageRating = r.avg_rating;

UPDATE food_establishment fe
JOIN (
    SELECT 
        businessid, 
        AVG(rating) AS avg_rating
    FROM 
        review
    WHERE 
        businessid IS NOT NULL
    GROUP BY 
        businessid
) r ON fe.businessid = r.businessid
SET 
    fe.averageRating = r.avg_rating;