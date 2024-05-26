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
} from "./controllers/reports.js";
import {
  addFoodReview,
  updateFoodReview,
  deleteFoodReview,
  addFoodEstablishment,
  updateFoodEstablishment,
  deleteFoodEstablishment,
} from "./controllers/features.js";
import { checkUserType } from "./controllers/middleware.js";

const router = (app) => {
  //endpoints for reports
  app.get("/view-all-establishments", viewAllEstablishments);
  app.post(
    "/view-all-reviews-for-establishment",
    viewAllReviewsForEstablishment
  );
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

  /**************FEATURES*********************** */
  //checkUserType(1) - meaning userType 1 (users) lang pwede makaaccess. Magfforbidden kapag ibang user
  //Reviews
  app.post("/review/add", checkUserType(1), addFoodReview);
  app.post("/review/update", checkUserType(1), updateFoodReview);
  app.post("/review/delete", checkUserType(1), deleteFoodReview);

  //checkUserType(2) - meaning userType 2 lang pwede makaaccess. Magfforbidden kapag ibang user
  //Food Establishment
  app.post("/establishment/add", checkUserType(2), addFoodEstablishment);
  app.post("establishment/delete", checkUserType(2), deleteFoodEstablishment);
  app.post("establishment/update", checkUserType(2), updateFoodEstablishment);
};

export default router;
