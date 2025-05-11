const Review = require('../models/Review');
const User = require('../models/User');
const mongoose = require('mongoose');

const getUserReviews = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const clerkId = req.auth.userId;
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId });

        // Find all reviews where this user is the reviewer
        const reviews = await Review.find({ reviewer: clerkId })
            .populate({
                path: 'product',
                select: 'title images' // Select only needed fields
            })
            .sort({ createdAt: -1 });

        const obj = {
            reviews: reviews.map(review => ({
                id: review._id,
                type: review.reviewType === "owner" ? "asOwner" : "asRenter",
                reviewer: {
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.profileImage,
                    initials: `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
                },
                rating: review.rating,
                date: review.createdAt.toISOString().split('T')[0],
                comment: review.comment || "",
                product: {
                    title: review.product?.title || "Product"
                }
            })),
            summary: {
                asRenter: {
                    count: reviews.filter(r => r.reviewType === "renter").length,
                    average: calculateAverage(reviews.filter(r => r.reviewType === "renter"))
                }
            },
        };

        res.status(200).json(obj);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Server error while fetching user reviews' });
    }
};

// Helper function to calculate average rating
function calculateAverage(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
}

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find reviews for this product
        const reviews = await Review.find({
            product: productId,
            reviewType: "product" // Only get product reviews, not renter/owner reviews
        })
            .sort({ createdAt: -1 });

        // Format reviews for client with reviewer details
        const formattedReviews = await Promise.all(reviews.map(async review => {
            let reviewerName = "Anonymous User";
            let reviewerInitials = "AU";
            let reviewerAvatar = null;

            try {
                if (mongoose.Types.ObjectId.isValid(review.reviewer)) {
                    const reviewerUser = await User.findById(review.reviewer);
                    if (reviewerUser) {
                        reviewerName = `${reviewerUser.firstName || ''} ${reviewerUser.lastName || ''}`.trim();
                        reviewerInitials = `${(reviewerUser.firstName || '').charAt(0)}${(reviewerUser.lastName || '').charAt(0)}`.toUpperCase();
                        reviewerAvatar = reviewerUser.profileImage;
                    }
                }
            } catch (err) {
                console.error("Error fetching reviewer details:", err);
            }

            return {
                id: review._id,
                reviewer: {
                    name: reviewerName,
                    avatar: reviewerAvatar,
                    initials: reviewerInitials
                },
                rating: review.rating,
                date: review.createdAt.toISOString().split('T')[0],
                comment: review.comment || ""
            };
        }));

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ?
            parseFloat((totalRating / reviews.length).toFixed(1)) : 0;

        // Count ratings by stars (1-5)
        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };

        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        res.status(200).json({
            reviews: formattedReviews,
            summary: {
                count: reviews.length,
                average: averageRating,
                distribution: ratingDistribution
            }
        });
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({ message: 'Server error while fetching product reviews' });
    }
};

/**
 * Helper function to get all product IDs owned by a user
 */
const getProductsOwnedByUser = async (userId) => {
    try {
        const products = await mongoose.model('Product').find({ owner: userId });
        return products.map(p => p._id);
    } catch (error) {
        console.error('Error fetching user products:', error);
        return [];
    }
};

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Private
 */
const createReview = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId, rating, comment, reviewType } = req.body;

        if (!productId || !rating || !reviewType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Validate review type
        if (!['product', 'renter', 'owner'].includes(reviewType)) {
            return res.status(400).json({ message: 'Invalid review type' });
        }

        const clerkId = req.auth.userId;

        // Find user in database
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new review
        const newReview = new Review({
            reviewer: user._id.toString(),
            product: productId,
            rating,
            comment: comment || '',
            reviewType
        });

        await newReview.save();

        res.status(201).json({
            success: true,
            review: newReview
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error while creating review' });
    }
};

/**
 * Delete a review (admin or review owner only)
 * @route DELETE /api/reviews/:reviewId
 * @access Private
 */
const deleteReview = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({ message: 'Review ID is required' });
        }

        const clerkId = req.auth.userId;

        // Find user in database
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is the owner of the review or an admin
        const isAdmin = user.role === 'admin';
        const isOwner = review.reviewer === user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error while deleting review' });
    }
};

module.exports = {
    getUserReviews,
    createReview,
    getProductReviews,
    deleteReview
};
