import ReviewSchema from "./ReviewSchema.js";
//Insert new Review
export const createReview = (reviewObj) => {
  return ReviewSchema(reviewObj).save();
};
//Use filter to get Reviews for specific user
//If @filter is undefined, it will return entire records
export const getReviews = (filter) => {
  // return ReviewSchema.find(filter).sort({ updatedAt: -1 });
  return ReviewSchema.find(filter)
    .populate({
      path: "bookId",
      select: "title slug imgUrl",
    })
    .sort({ updatedAt: -1 });
};
//Update Review table
export const updateReview = ({ _id, ...rest }) => {
  return ReviewSchema.findByIdAndUpdate(_id, rest);
};
//Delete Review object
// export const deleteReview = (filter) => {
//   return ReviewSchema.findOneAndDelete(filter);
// };
