# Puntahe-Putahe

## Description

Puntahe-Putahe is a project for the CMSC 127: File Processing and Database Systems course at the University of the Philippines Los Baños. This project showcases students' mastery of Database Management Systems and the Structured Query Language. It is built using ReactJS, TailwindCSS, MariaDB, and Express.

## How to Run

### Install Dependencies

1. In your terminal, navigate to the backend folder and type: ```npm i```.
2. Then navigate to the frontend folder and type: ```npm i```.


### Run APIs and React App

1. Open a terminal dedicated to the server/database. Navigate to the backend folder and type: ```npm run dev``` or ```node index.js```.

2. Open another terminal dedicated to the React app. Navigate to the frontend folder and type: ```npm start```. It should automatically open a browser to [http://localhost:3000/](http://localhost:3000/). If not, check if port 3000 is in use; the terminal will prompt you if you want to use another port.

### Database Initialization (Optional)

1. You may use the provided `script.sql` to set up the initial database schema and insert default data.
2. Open a MariaDB-supported terminal. Log in to your root account and type: ```source <path-to-script.sql>```. This will initialize the database with default data for testing.

### Enjoy and you may now start using the app
You may now start using the app. Note that there is no signup functionality, so a user must be added to the database manually. You may also check `script.sql` for a list of default data.

## App Details and Functionalities

### User Types

- **Manager**: Handles the food establishment and their foods assigned to them. They can register an establishment and add foods to that establishment. They are the only ones allowed to delete and modify the establishments and foods that they registered. They are not allowed to remove reviews.
- **Admin**: Responsible for content moderation. They are allowed to delete reviews, food items, and establishments when necessary.
- **General User**: Can create reviews for establishments and food items. They can edit and modify their own reviews. They can also search for establishments/food and filter them by type and price range.

### Features

- Add, update, and delete food reviews on a food establishment.
- Add, update, and delete food reviews on a food item.
- Add, update, delete, and search for food establishments.
- Add, update, delete, and search for food items.

### Reports

- View all food establishments.
- View all food reviews for a food establishment or a food item.
- View all food items from a food establishment.
- View all food items from a food establishment that belong to a specific food type (meat, veggie, etc.).
- View all food reviews within 1 month for a food establishment or a food item.
- View all food establishments with a high average rating (rating >= 4).
- View all food items from a food establishment arranged by price.
- Search food items from any food establishment based on price range or food type.

## Technical Details

- **Frontend**: ReactJS, TailwindCSS
- **Backend**: Express, Node.js
- **Database**: MariaDB

## Contact the Authors

You may contact any of the contributors of this repository for any questions or clarifications:

- [@eljohnevnglsta](mailto:eyevangelista1@up.edu.ph)
- [@elcartedave](mailto:daelcarte@up.edu.ph)
- [@cazhiareese](mailto:clleva@up.edu.ph)