import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
  updateProducts();
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

const updateProducts = async () => {
  try {
    console.log("Starting migration...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);
    
    for (const product of products) {
      // Map old category to new mainCategory
      let mainCategory = "Cakes";
      let subCategory = "Regular";
      
      // Map the category name to the appropriate value
      if (product.category && product.category.toLowerCase().includes("cake")) {
        mainCategory = "Cakes";
      } else if (product.category && product.category.toLowerCase().includes("cupcake")) {
        mainCategory = "Cup-Cakes";
      } else if (product.category && product.category.toLowerCase().includes("pastry")) {
        mainCategory = "Pastry";
      } else if (product.category && product.category.toLowerCase().includes("dessert")) {
        mainCategory = "Desserts";
      }
      
      // Determine special cake types from name or description
      let cakeType = "Regular";
      const productText = `${product.name?.toLowerCase() || ''} ${product.description?.toLowerCase() || ''}`;
      
      if (productText.includes("pull me up")) cakeType = "Pull Me Up";
      else if (productText.includes("pinata")) cakeType = "Pinata";
      else if (productText.includes("half cake")) cakeType = "Half Cake";
      else if (productText.includes("bomb")) cakeType = "Bomb Cake";
      else if (productText.includes("bento")) cakeType = "Bento Cake";
      else if (productText.includes("surprise box")) cakeType = "Surprise Box";
      else if (productText.includes("photo pulling")) cakeType = "Photo Pulling";
      else if (productText.includes("mousse")) cakeType = "Mousse";
      
      // Map layer to the appropriate enum value
      let layer = "One";
      if (product.layer === 2 || product.layer === "2") layer = "Two";
      else if (product.layer === 3 || product.layer === "3") layer = "Three";
      
      // Normalize shape
      let shape = "Circle";
      if (product.shape && product.shape.toLowerCase() === "round") shape = "Circle";
      else if (product.shape && ["square", "heart", "tall"].includes(product.shape.toLowerCase())) {
        shape = product.shape.charAt(0).toUpperCase() + product.shape.slice(1).toLowerCase();
      } else {
        shape = "Other";
      }
      
      // Normalize flavor
      let flavor = product.flavor || "Other";
      const knownFlavors = [
        "chocolate", "blueberry", "pineapple", "fresh fruit", 
        "red velvet", "vanilla", "butterscotch"
      ];
      
      if (flavor && !knownFlavors.includes(flavor.toLowerCase())) {
        flavor = "Other";
      } else if (flavor) {
        // Capitalize first letter
        flavor = flavor.charAt(0).toUpperCase() + flavor.slice(1).toLowerCase();
      }
      
      // Check for festivals in occasion or description
      let festival = "None";
      const festivalKeywords = {
        "valentine": "Valentine's Day",
        "christmas": "Christmas",
        "friendship": "Friendship's Day",
        "teacher": "Teacher's Day",
        "new year": "New Year"
      };
      
      for (const [keyword, festivalName] of Object.entries(festivalKeywords)) {
        if (productText.includes(keyword.toLowerCase())) {
          festival = festivalName;
          break;
        }
      }
      
      // Generate tags based on product attributes
      const tags = [
        product.flavor?.toLowerCase(),
        product.shape?.toLowerCase(),
        product.occasion?.toLowerCase(),
        product.eggOrEggless?.toLowerCase(),
        ...product.name?.toLowerCase().split(" ") || []
      ].filter(tag => tag); // Filter out any undefined values
      
      // Update the product
      product.mainCategory = mainCategory;
      product.subCategory = subCategory;
      product.layer = layer;
      product.shape = shape;
      product.flavor = flavor;
      product.festival = festival;
      product.cakeType = cakeType;
      product.tags = [...new Set(tags)]; // Remove duplicates
      
      // Set isActive if it doesn't exist
      if (product.isActive === undefined) {
        product.isActive = true;
      }
      
      // Set customization defaults if they don't exist
      if (!product.customization) {
        product.customization = {
          allowMessageOnCake: true,
          allowCustomDesign: false,
          extraChargeForCustomization: 0
        };
      }
      
      // Add featured and bestSeller flags if they don't exist
      if (product.featured === undefined) {
        product.featured = false;
      }
      
      if (product.isBestSeller === undefined) {
        product.isBestSeller = false;
      }
      
      // Add nutritionalInfo if it doesn't exist
      if (!product.nutritionalInfo) {
        product.nutritionalInfo = {
          calories: null,
          sugar: null,
          fat: null
        };
      }
      
      try {
        await product.save();
        console.log(`Updated product: ${product.name}`);
      } catch (error) {
        console.error(`Error updating product ${product.name}:`, error.message);
      }
    }
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.disconnect();
    console.log("Database connection closed");
  }
};