const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef {Object} IPayment
 * @property {mongoose.Types.ObjectId} user
 * @property {mongoose.Types.ObjectId} order
 * @property {number} amount
 * @property {string} currency
 * @property {string} paymentMethod
 * @property {string} paymentId
 * @property {string} status - "pending" | "completed" | "failed" | "refunded" | "partially_refunded"
 * @property {number} [transactionFee]
 * @property {number} [refundAmount]
 * @property {string} [refundReason]
 * @property {Object} [metadata]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const PaymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please provide an order"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Please provide a currency"],
      default: "USD",
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide a payment method"],
    },
    paymentId: {
      type: String,
      required: [true, "Please provide a payment ID"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    transactionFee: {
      type: Number,
      min: [0, "Transaction fee cannot be negative"],
    },
    refundAmount: {
      type: Number,
      min: [0, "Refund amount cannot be negative"],
    },
    refundReason: String,
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ order: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentId: 1 });

module.exports = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
