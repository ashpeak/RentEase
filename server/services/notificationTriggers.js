/**
 * This module contains functions to create notifications for various system events
 */
const { createNotification } = require('../controllers/notificationController');
const mongoose = require('mongoose');

/**
 * Create a notification when a user requests to rent an item
 * @param {string} ownerUserId - Clerk ID of the product owner
 * @param {string} renterUserId - Clerk ID of the user who wants to rent
 * @param {Object} rental - Rental order object
 * @param {Object} product - Product being rented
 */
const createRentalRequestNotification = async (ownerUserId, renterUserId, rental, product) => {
  try {
    // Get user details
    const renter = await mongoose.model("User").findOne({ clerkId: renterUserId }).lean();
    
    if (!renter) {
      console.error('Renter not found:', renterUserId);
      return;
    }
    
    const rentalDuration = getRentalDuration(rental.startDate, rental.endDate);
    
    await createNotification(
      ownerUserId,
      'rental_request',
      'New Rental Request',
      `${renter.firstName} ${renter.lastName} wants to rent your ${product.name} for ${rentalDuration}.`,
      {
        relatedId: rental._id,
        relatedModel: 'Order',
        actionUrl: `/dashboard/rentals/${rental._id}`,
        sender: {
          id: renterUserId,
          name: `${renter.firstName} ${renter.lastName}`,
          image: renter.profileImage
        }
      }
    );
  } catch (error) {
    console.error('Error creating rental request notification:', error);
  }
};

/**
 * Create a notification when a rental request is approved
 * @param {string} renterUserId - Clerk ID of the user who wants to rent
 * @param {Object} rental - Rental order object
 * @param {Object} product - Product being rented
 */
const createRentalApprovedNotification = async (renterUserId, rental, product) => {
  try {
    await createNotification(
      renterUserId,
      'rental_approved',
      'Rental Approved',
      `Your request to rent the ${product.name} has been approved.`,
      {
        relatedId: rental._id,
        relatedModel: 'Order',
        actionUrl: `/dashboard/rentals/${rental._id}`
      }
    );
  } catch (error) {
    console.error('Error creating rental approved notification:', error);
  }
};

/**
 * Create a notification when a rental request is declined
 * @param {string} renterUserId - Clerk ID of the user who wants to rent
 * @param {Object} rental - Rental order object
 * @param {Object} product - Product being rented
 * @param {string} reason - Reason for declining the rental
 */
const createRentalDeclinedNotification = async (renterUserId, rental, product, reason) => {
  try {
    await createNotification(
      renterUserId,
      'rental_declined',
      'Rental Declined',
      `Your request to rent the ${product.name} has been declined${reason ? ': ' + reason : '.'}`,
      {
        relatedId: rental._id,
        relatedModel: 'Order',
        actionUrl: `/dashboard/rentals/${rental._id}`
      }
    );
  } catch (error) {
    console.error('Error creating rental declined notification:', error);
  }
};

/**
 * Create a notification when a payment is received
 * @param {string} ownerUserId - Clerk ID of the product owner
 * @param {Object} payment - Payment object
 * @param {Object} product - Product being rented
 */
const createPaymentReceivedNotification = async (ownerUserId, payment, product) => {
  try {
    await createNotification(
      ownerUserId,
      'payment',
      'Payment Received',
      `You received ${formatCurrency(payment.amount)} for the rental of your ${product.name}.`,
      {
        relatedId: payment._id,
        relatedModel: 'Payment',
        actionUrl: `/dashboard/payments`
      }
    );
  } catch (error) {
    console.error('Error creating payment received notification:', error);
  }
};

/**
 * Create a notification when a review is received
 * @param {string} ownerUserId - Clerk ID of the product owner
 * @param {string} reviewerUserId - Clerk ID of the user who left the review
 * @param {Object} review - Review object
 * @param {Object} product - Product being reviewed
 */
const createReviewNotification = async (ownerUserId, reviewerUserId, review, product) => {
  try {
    // Get reviewer details
    const reviewer = await mongoose.model("User").findOne({ clerkId: reviewerUserId }).lean();
    
    if (!reviewer) {
      console.error('Reviewer not found:', reviewerUserId);
      return;
    }
    
    await createNotification(
      ownerUserId,
      'review',
      'New Review',
      `${reviewer.firstName} ${reviewer.lastName} left a ${review.rating}-star review on your ${product.name}.`,
      {
        relatedId: review._id,
        relatedModel: 'Review',
        actionUrl: `/dashboard/listings/${product._id}`,
        sender: {
          id: reviewerUserId,
          name: `${reviewer.firstName} ${reviewer.lastName}`,
          image: reviewer.profileImage
        }
      }
    );
  } catch (error) {
    console.error('Error creating review notification:', error);
  }
};

/**
 * Create a notification for a system message
 * @param {string} userId - Clerk ID of the user to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} actionUrl - Optional URL to link to
 */
const createSystemNotification = async (userId, title, message, actionUrl) => {
  try {
    await createNotification(
      userId,
      'system',
      title,
      message,
      {
        actionUrl
      }
    );
  } catch (error) {
    console.error('Error creating system notification:', error);
  }
};

// Helper functions
const getRentalDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1 ? '1 day' : `${diffDays} days`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

module.exports = {
  createRentalRequestNotification,
  createRentalApprovedNotification,
  createRentalDeclinedNotification,
  createPaymentReceivedNotification,
  createReviewNotification,
  createSystemNotification
};
