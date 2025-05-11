import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Address interface for User model
 */
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * User interface for Document properties
 */
export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  profileImage: string;
  phone?: string;
  address?: IAddress;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin';
  lastLogin?: Date;
  reviewsGiven: mongoose.Types.ObjectId[];
  reviewsReceived: mongoose.Types.ObjectId[];
  averageRatingAsRenter: number;
  numReviewsAsRenter: number;
  averageRatingAsOwner: number;
  numReviewsAsOwner: number;
  
  // Virtual fields
  listings?: mongoose.Types.ObjectId[];
  rentals?: mongoose.Types.ObjectId[];
  reviewsVirtual?: mongoose.Types.ObjectId[];
  wishlist?: mongoose.Types.ObjectId;
  
  // Methods
  updateAverageRatingAsRenter(): Promise<void>;
  updateAverageRatingAsOwner(): Promise<void>;
}

/**
 * User model schema
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    clerkId: {
      type: String,
      required: [true, "Please provide a userId"],
      unique: true,
      trim: true,
      maxlength: [50, "UserId cannot be more than 50 characters"],
    },
    profileImage: {
      type: String,
      default: "/placeholder.svg?height=200&width=200",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
    // Add new fields for reviews
    reviewsGiven: [ // Reviews this user has written
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    reviewsReceived: [ // Reviews other users have written about this user (as owner or renter)
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    // Average rating as a renter (based on reviews where this user was the renter)
    averageRatingAsRenter: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviewsAsRenter: {
      type: Number,
      default: 0,
    },
    // Average rating as an owner/lender (based on reviews where this user was the item owner)
    averageRatingAsOwner: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviewsAsOwner: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields for relationships
UserSchema.virtual("listings", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("rentals", {
  ref: "Order",
  localField: "_id",
  foreignField: "renter",
});

UserSchema.virtual("reviewsVirtual", {
  ref: "Review",
  localField: "_id",
  foreignField: "reviewer",
});

UserSchema.virtual("wishlist", {
  ref: "Wishlist",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// Method to update average rating as renter
UserSchema.methods.updateAverageRatingAsRenter = async function(this: IUser): Promise<void> {
  const reviews = await mongoose.model("Review").find({ reviewedUser: this._id, reviewType: "renter" });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    this.averageRatingAsRenter = totalRating / reviews.length;
    this.numReviewsAsRenter = reviews.length;
  } else {
    this.averageRatingAsRenter = 0;
    this.numReviewsAsRenter = 0;
  }
  await this.save();
};

// Method to update average rating as owner
UserSchema.methods.updateAverageRatingAsOwner = async function(this: IUser): Promise<void> {
  const reviews = await mongoose.model("Review").find({ reviewedUser: this._id, reviewType: "owner" });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    this.averageRatingAsOwner = totalRating / reviews.length;
    this.numReviewsAsOwner = reviews.length;
  } else {
    this.averageRatingAsOwner = 0;
    this.numReviewsAsOwner = 0;
  }
  await this.save();
};

// Create the model type that combines the document interface with the static methods
interface UserModel extends Model<IUser> {}

// Export the model (using ES Module syntax)
const User = (mongoose.models.User || mongoose.model<IUser, UserModel>("User", UserSchema)) as UserModel;

export default User;
