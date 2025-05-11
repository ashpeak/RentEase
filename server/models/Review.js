const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    reviewer: {
      type: String,
      ref: "User",
      required: [true, "Please provide a reviewer"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    reviewType: {
        type: String,
        enum: ["product", "renter", "owner"],
        required: [true, "Please specify the review type"],
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
