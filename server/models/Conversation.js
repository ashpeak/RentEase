const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @typedef {Object} IMessage
 * @property {mongoose.Types.ObjectId} sender
 * @property {string} content
 * @property {Date} [readAt]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} IConversation
 * @property {mongoose.Types.ObjectId[]} participants
 * @property {IMessage[]} messages
 * @property {mongoose.Types.ObjectId} [product]
 * @property {Object} lastMessage
 * @property {string} lastMessage.content
 * @property {mongoose.Types.ObjectId} lastMessage.sender
 * @property {Date} lastMessage.createdAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a sender"],
    },
    content: {
      type: String,
      required: [true, "Please provide message content"],
      trim: true,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

const ConversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: [true, "Please provide participants"],
      validate: {
        validator: (v) => v.length === 2,
        message: "A conversation must have exactly 2 participants",
      },
    },
    messages: [MessageSchema],
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    lastMessage: {
      content: {
        type: String,
        required: true,
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ product: 1 });

module.exports = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
