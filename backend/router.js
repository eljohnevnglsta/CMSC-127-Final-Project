import { viewAllEstablishments, 
    viewAllReviewsForEstablishment, 
    viewAllReviewsForFoodItem, 
    viewAllFoodItemsForEstablishment,
    viewAllFoodItemsForEstablishmentByType,
    viewAllReviewsForMonth,
    viewHighlyRatedEstablishments,
    viewAllFoodItemsForEstablishmentByPrice,
    searchFoodItemsByPrice
} 
    from "./controllers/reports.js";

const router = (app) => {

    //endpoints for reports
    app.get('/view-all-establishments', viewAllEstablishments);
    app.post('/view-all-reviews-for-establishment', viewAllReviewsForEstablishment);
    app.post('/view-all-reviews-for-food-item', viewAllReviewsForFoodItem);
    app.post('/view-all-food-items-for-establishment', viewAllFoodItemsForEstablishment);
    app.post('/view-all-food-items-for-establishment-by-type', viewAllFoodItemsForEstablishmentByType);
    app.post('/view-all-reviews-for-month', viewAllReviewsForMonth);
    app.get('/view-highly-rated-establishments', viewHighlyRatedEstablishments);
    app.post('/view-all-food-items-for-establishment-by-price', viewAllFoodItemsForEstablishmentByPrice);
    app.post('/search-food-items-by-price', searchFoodItemsByPrice);
}   

export default router;