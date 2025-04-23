import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    
    // Main category and subcategory
    mainCategory: { 
      type: String, 
      required: true,
      enum: ["Cakes", "Cup-Cakes", "Pastry", "Desserts"]
    },
    subCategory: { 
      type: String,
      enum: ["Regular", "Trending Cakes", "Unique Cakes", "Featured Cakes"]
    },
    
    // Product attributes
    stock: { type: Number, required: true, default: 10 },
    layer: { 
      type: String, 
      required: true, 
      enum: ["One", "Two", "Three"],
      default: "One" 
    },
    images: [{ type: String, required: true }],
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    weight: { type: String, required: true },
    
    // Characteristics
    flavor: { 
      type: String, 
      required: true,
      enum: [
        "Chocolate", "Blueberry", "Pineapple", "Fresh Fruit", 
        "Red Velvet", "Vanilla", "Butterscotch", "Other"
      ]
    },
    shape: { 
      type: String, 
      required: true,
      enum: ["Square", "Circle", "Heart", "Tall", "Other"]
    },
    
    // Occasions and festivals
    occasion: { 
      type: String, 
      required: true,
      enum: [
        "Birthday", "Anniversary", "Wedding", "Baby Shower", 
        "Engagement", "Mother's Day", "Father's Day", "Other"
      ]
    },
    festival: { 
      type: String,
      enum: [
        "Valentine's Day", "Christmas", "Friendship's Day", 
        "Teacher's Day", "New Year", "Farewell Cakes", "Classic Cakes", "None"
      ],
      default: "None"
    },
    
    // Special cake types
    cakeType: {
      type: String,
      enum: [
        "Regular", "Pull Me Up Cake", "Pinata Cake", "Half Cake", "Bomb Cake", 
        "Bento Cake", "Surprise Cake Box", "Photo Pulling Cake", "Mousse", "None"
      ],
      default: "Regular"
    },
    
    eggOrEggless: { 
      type: String, 
      enum: ["Egg", "Eggless"], 
      required: true 
    },
    
    customization: {
      allowMessageOnCake: { type: Boolean, default: true },
      allowCustomDesign: { type: Boolean, default: false },
      extraChargeForCustomization: { type: Number, default: 0 },
    },
    
    ingredients: [String],
    nutritionalInfo: {
      calories: Number,
      sugar: Number,
      fat: Number,
    },
    
    // Tags and filtering options
    tags: [String],
    featured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    availableFrom: { type: Date, default: Date.now },
    availableUntil: { type: Date },
  },
  { timestamps: true }
);

// Create indexes for search and filtering
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ mainCategory: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ layer: 1 });
productSchema.index({ flavor: 1 });
productSchema.index({ shape: 1 });
productSchema.index({ occasion: 1 });
productSchema.index({ festival: 1 });
productSchema.index({ cakeType: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNew: 1 });

// Add a method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const sum = this.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    this.avgRating = sum / this.reviews.length;
  }
  this.numReviews = this.reviews.length;
  return this.save();
};

const Product = mongoose.model("Product", productSchema);
export default Product;