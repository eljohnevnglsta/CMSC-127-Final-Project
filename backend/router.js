import {
  viewAllEstablishments,
  viewAllReviewsForEstablishment,
  viewAllReviewsForFoodItem,
  viewAllFoodItemsForEstablishment,
  viewAllFoodItemsForEstablishmentByType,
  viewAllReviewsForMonth,
  viewHighlyRatedEstablishments,
  viewAllFoodItemsForEstablishmentByPrice,
  searchFoodItemsByPrice,
  selectType,
  selectBusinessOfFood,
  selectOneFood,
  viewAllReviewsForFoodMonth,
  getBusinessId,
  getFoodCode,
  viewAllReviews,
  getReview,
} from "./controllers/reports.js";

import {
  addReview,
  updateReview,
  deleteReview,
  addFoodEstablishment,
  updateFoodEstablishment,
  deleteFoodEstablishment,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  searchFoodItem,
  searchFoodEstablishment,
} from "./controllers/features.js";

import { checkUserType } from "./controllers/middleware.js";
import { logIn } from "./controllers/authentication.js";

const router = (app) => {
  //endpoints for reports
  app.get("/view-all-establishments", viewAllEstablishments);

  app.post("/view-all-reviews-for-food-item", viewAllReviewsForFoodItem);
  app.post(
    "/view-all-food-items-for-establishment",
    viewAllFoodItemsForEstablishment
  );
  app.post(
    "/view-all-food-items-for-establishment-by-type",
    viewAllFoodItemsForEstablishmentByType
  );
  app.post("/view-all-reviews-for-month", viewAllReviewsForMonth);
  app.get("/view-highly-rated-establishments", viewHighlyRatedEstablishments);
  app.post(
    "/view-all-food-items-for-establishment-by-price",
    viewAllFoodItemsForEstablishmentByPrice
  );
  app.post("/search-food-items-by-price", searchFoodItemsByPrice);
  app.get("/select-type", selectType);
  app.post("/view-establishment-review", viewAllReviewsForEstablishment);
  app.post("/select-food-business", selectBusinessOfFood);
  app.post("/select-food", selectOneFood);
  app.post("/select-food-review-month", viewAllReviewsForFoodMonth);
  /**************FEATURES*********************** */
  //checkUserType(1) - meaning userType 1 (users) lang pwede makaaccess. Magfforbidden kapag ibang user
  //Reviews
  app.post("/review/add", checkUserType(1), addReview);
  app.post("/review/update", checkUserType(1), updateReview);
  app.post("/review/delete", checkUserType(1), deleteReview);

  //checkUserType(2) - meaning userType 2 lang pwede makaaccess. Magfforbidden kapag ibang usertype
  //Food Establishment
  app.post("/establishment/add", checkUserType(2), addFoodEstablishment);
  app.post("/establishment/delete", checkUserType(2), deleteFoodEstablishment);
  app.post("/establishment/update", checkUserType(2), updateFoodEstablishment);
  app.post("/establishment/search", searchFoodEstablishment); //since anyone can search

  // Food Items
  app.post("/food-item/add", checkUserType(2), addFoodItem);
  app.post("/food-item/update", checkUserType(2), updateFoodItem);
  app.post("/food-item/delete", checkUserType(2), deleteFoodItem);
  app.post("/food-item/search", searchFoodItem);

  //authentication
  app.post("/login", logIn);

  //getters
  app.post("/get-business", getBusinessId);
  app.post("/get-food", getFoodCode);
  app.post("/get-review", getReview);
};

export default router;
