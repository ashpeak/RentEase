const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
      validate: {
        validator: (v) => v.length > 0,
        message: "Please provide at least one image",
      },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "rented", "unavailable", "paused"],
      default: "available",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    tags: [String],
    condition: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "worn"],
      required: [true, "Please specify the condition"],
    },
    rate: {
      type: Number,
      required: [true, "Please provide a rental rate"],
    },
    weeklyRate: {
      type: Number,
      min: [0, "Weekly rate cannot be negative"],
    },
    monthlyRate: {
      type: Number,
      min: [0, "Monthly rate cannot be negative"],
    },
    securityDeposit: {
      type: Number,
      required: [true, "Please provide a security deposit amount"],
      min: [0, "Security deposit cannot be negative"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Please provide an address"],
      },
      city: {
        type: String,
        required: [true, "Please provide a city"],
      },
      state: {
        type: String,
        required: [true, "Please provide a state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please provide a zip code"],
      },
      country: {
        type: String,
        required: [true, "Please provide a country"],
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    availabilityCalendar: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    userId: {
      type: String,
      ref: "User",
      required: [true, "Please provide an owner"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an owner"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    specifications: {
      brand: { type: String },
      model: { type: String },
      rentalRules: { type: String },
      deliveryOptions: { type: Schema.Types.Mixed },
    },
    selectedPricingModel: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
      required: true,
    },
    minRentalPeriodValue: {
      type: Number,
      required: [true, "Please provide a minimum rental period"],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual fields for relationships
ProductSchema.virtual("reviewsVirtual", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

ProductSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "product",
});

// Create indexes
ProductSchema.index({ owner: 1 });
ProductSchema.index({ "location.city": 1, "location.state": 1 });
ProductSchema.index({ "location.coordinates": "2dsphere" });
ProductSchema.index({ title: "text", description: "text", tags: "text" });

// Method to update average rating
ProductSchema.methods.updateAverageRating = async function () {
  const reviews = await mongoose.model("Review").find({ product: this._id });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    this.averageRating = totalRating / reviews.length;
    this.numReviews = reviews.length;
  } else {
    this.averageRating = 0;
    this.numReviews = 0;
  }
  await this.save();
};

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
