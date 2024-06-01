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
	name VARCHAR(15) NOT NULL,
	type VARCHAR(15) NOT NULL,
	averageRating DECIMAL(5,4),
	street VARCHAR(20),
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
	name VARCHAR(15) NOT NULL,
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

INSERT INTO user (username, firstname, lastname, usertype, accesskey) VALUES
('user1', 'John', 'Doe', 1, 'ABCD1234'),
('user2', 'Jane', 'Smith', 1, 'EFGH5678'),
('user3', 'Alice', 'Johnson', 1, 'IJKL9101'),
('user4', 'Bob', 'Brown', 1, 'MNOP1121'),
('user5', 'Charlie', 'Davis', 1, 'QRST3141'),
('user6', 'Diana', 'Miller', 1, 'UVWX5161'),
('user7', 'Edward', 'Wilson', 1, 'YZAB7181'),
('user8', 'Fiona', 'Taylor', 1, 'CDEF9202'),
('user9', 'George', 'Anderson', 1, 'GHIJ1223'),
('user10', 'Hannah', 'Thomas', 1, 'KLMN3243'),
('manager1', 'Eljohn', 'Evangelista', 2, '00000000'),
('manager2', 'Cazhia', 'Lleva', 2, '00000001'),
('admin1', 'Dave', 'Elcarte', 2, '11111111');

INSERT INTO food_establishment (businessid, name, type, averageRating, street, barangay, city, province, username) VALUES
(1, 'Deli Delight', 'Deli', 4.5678, 'Main St', 'Barangay 1', 'City A', 'Province X', 'manager1'),
(2, 'Pizza Place', 'Pizza', 4.3456, '1st Ave', 'Barangay 2', 'City B', 'Province Y', 'manager1'),
(3, 'Burger Bonanza', 'Burger', 4.1234, '2nd St', 'Barangay 3', 'City C', 'Province Z', 'manager1'),
(4, 'Sushi Spot', 'Sushi', 4.5678, '3rd Ave', 'Barangay 4', 'City D', 'Province X', 'manager1'),
(5, 'Taco Town', 'Mexican', 4.3456, '4th St', 'Barangay 5', 'City E', 'Province Y', 'manager1'),
(6, 'Curry Corner', 'Indian', 4.1234, '5th Ave', 'Barangay 6', 'City F', 'Province Z', 'manager2'),
(7, 'Noodle Nest', 'Chinese', 4.5678, '6th St', 'Barangay 7', 'City G', 'Province X', 'manager2'),
(8, 'Grill Galore', 'BBQ', 4.3456, '7th Ave', 'Barangay 8', 'City H', 'Province Y', 'manager2'),
(9, 'Pasta Paradise', 'Italian', 4.1234, '8th St', 'Barangay 9', 'City I', 'Province Z', 'manager2'),
(10, 'Salad Stop', 'Healthy', 4.5678, '9th Ave', 'Barangay 10', 'City J', 'Province X', 'manager2');

INSERT INTO food (foodcode, name, price, isspecialty, isbestseller, averageRating, username, businessid) VALUES
(1, 'Ham Sandwich', 5.50, TRUE, FALSE, 4.5, 'manager1', 1),
(2, 'Pepperoni Pizza', 8.99, FALSE, TRUE, 4.3, 'manager1', 2),
(3, 'Cheeseburger', 7.25, TRUE, FALSE, 4.1, 'manager1', 3),
(4, 'California Roll', 12.00, FALSE, TRUE, 4.6, 'manager1', 4),
(5, 'Taco', 3.75, TRUE, FALSE, 4.3, 'manager1', 5),
(6, 'Chicken Curry', 9.50, FALSE, TRUE, 4.1, 'manager2', 6),
(7, 'Beef Noodles', 8.00, TRUE, FALSE, 4.6, 'manager2', 7),
(8, 'BBQ Ribs', 15.00, FALSE, TRUE, 4.3, 'manager2', 8),
(9, 'Spaghetti', 7.50, TRUE, FALSE, 4.1, 'manager2', 9),
(10, 'Caesar Salad', 6.50, FALSE, TRUE, 4.6, 'manager2', 10);

INSERT INTO food_type (foodcode, foodtype) VALUES
(1, 'Sandwich'),
(2, 'Pizza'),
(3, 'Burger'),
(4, 'Sushi'),
(5, 'Mexican'),
(6, 'Indian'),
(7, 'Chinese'),
(8, 'BBQ'),
(9, 'Pasta'),
(10, 'Salad');

INSERT INTO review (reviewid, content, reviewtype, date_added, date_updated, rating, username, businessid, foodcode) VALUES
(1, 'Delicious ham sandwich!', 2, '2023-01-01 10:00:00', NULL, 5, 'user2', NULL, 1),
(2, 'Best pepperoni pizza ever!', 2, '2023-02-01 11:00:00', NULL, 4, 'user3', NULL, 2),
(3, 'Great cheeseburger!', 2, '2023-03-01 12:00:00', NULL, 4, 'user4', NULL, 3),
(4, 'Loved the California roll!', 2, '2023-04-01 13:00:00', NULL, 5, 'user5', NULL, 4),
(5, 'Tasty taco!', 2, '2023-05-01 14:00:00', NULL, 4, 'user6', NULL, 5),
(6, 'Amazing chicken curry!', 2, '2023-06-01 15:00:00', NULL, 5, 'user7', NULL, 6),
(7, 'Delicious beef noodles!', 2, '2023-07-01 16:00:00', NULL, 4, 'user8', NULL, 7),
(8, 'BBQ ribs were great!', 2, '2023-08-01 17:00:00', NULL, 5, 'user9', NULL, 8),
(9, 'Loved the spaghetti!', 2, '2023-09-01 18:00:00', NULL, 4, 'user10', NULL, 9),
(10, 'Caesar salad was fresh!', 2, '2023-10-01 19:00:00', NULL, 5, 'user1', NULL, 10);

INSERT INTO review (reviewid, content, reviewtype, date_added, date_updated, rating, username, businessid, foodcode) VALUES
(11, 'Place is nice', 1, '2023-01-01 10:00:00', NULL, 5, 'user2', 1, NULL),
(12, 'Good ambience!', 1, '2023-02-01 11:00:00', NULL, 4, 'user3', 2, NULL),
(13, 'Peaceful!', 1, '2023-03-01 12:00:00', NULL, 4, 'user4', 3, NULL),
(14, 'Ganda', 1, '2023-04-01 13:00:00', NULL, 5, 'user5', 4, NULL),
(15, 'People are nice', 1, '2023-05-01 14:00:00', NULL, 4, 'user6', 5, NULL),
(16, 'Amazing facilities', 1, '2023-06-01 15:00:00', NULL, 5, 'user7', 6, NULL),
(17, 'Good', 1, '2023-07-01 16:00:00', NULL, 4, 'user8', 7, NULL),
(18, 'Great', 1, '2023-08-01 17:00:00', NULL, 5, 'user9', 8, NULL),
(19, 'Love it', 1, '2023-09-01 18:00:00', NULL, 4, 'user10', 9, NULL),
(20, 'Relaxing', 1, '2023-10-01 19:00:00', NULL, 5, 'user1', 10, NULL);