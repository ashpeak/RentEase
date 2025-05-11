const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef {Object} ICategory
 * @property {string} name
 * @property {string} [description]
 * @property {string} [icon]
 * @property {string} slug
 * @property {mongoose.Types.ObjectId} [parent]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    icon: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Virtual for products in this category
CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

// Create indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

module.exports = mongoose.models.Category || mongoose.model("Category", CategorySchema);
