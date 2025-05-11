import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string
  email: string
  clerkId: string
  profileImage?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

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
    clerkId: { type: String, required: true, unique: true },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual fields for relationships
UserSchema.virtual("listings", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner",
})

UserSchema.virtual("rentals", {
  ref: "Order",
  localField: "_id",
  foreignField: "renter",
})

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "reviewer",
})

UserSchema.virtual("wishlist", {
  ref: "Wishlist",
  localField: "_id",
  foreignField: "user",
  justOne: true,
})

// Create indexes
UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)