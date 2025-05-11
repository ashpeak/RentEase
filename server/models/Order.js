const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    renter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a renter"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an owner"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date"],
    },
    totalDays: {
      type: Number,
      required: [true, "Please provide total days"],
      min: [1, "Total days must be at least 1"],
    },
    rentalRate: {
      type: Number,
      required: [true, "Please provide a rental rate"],
      min: [0, "Rental rate cannot be negative"],
    },
    securityDeposit: {
      type: Number,
      required: [true, "Please provide a security deposit"],
      min: [0, "Security deposit cannot be negative"],
    },
    serviceFee: {
      type: Number,
      required: [true, "Please provide a service fee"],
      min: [0, "Service fee cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please provide a total amount"],
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled", "disputed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentMethod: String,
    paymentId: String,
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: [true, "Please provide a delivery method"],
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    cancellationReason: String,
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique order number before saving
OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    this.orderNumber = `ORD-${year}${month}${day}-${random}`
  }
  next()
});

// Create indexes
OrderSchema.index({ renter: 1 });
OrderSchema.index({ owner: 1 });
OrderSchema.index({ product: 1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
