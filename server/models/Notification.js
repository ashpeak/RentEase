const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef {Object} INotification
 * @property {mongoose.Types.ObjectId} user
 * @property {string} type - "system" | "order" | "message" | "review" | "payment"
 * @property {string} title
 * @property {string} message
 * @property {boolean} isRead
 * @property {mongoose.Types.ObjectId} [relatedId]
 * @property {string} [relatedModel]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    type: {
      type: String,
      enum: ["system", "order", "message", "review", "payment"],
      required: [true, "Please provide a notification type"],
    },
    title: {
      type: String,
      required: [true, "Please provide a notification title"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide a notification message"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    relatedModel: {
      type: String,
      enum: ["Order", "Product", "Conversation", "Review", "Payment"],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
NotificationSchema.index({ user: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
