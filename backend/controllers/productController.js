import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import NodeCache from "node-cache";

// Initialize cache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300 });

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  // Check if data exists in cache
  const cacheKey = "all_products";
  const cachedProducts = cache.get(cacheKey);

  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  // Modified query to include both active products and products without isActive field
  const products = await Product.find({
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  });

  // Store in cache
  cache.set(cacheKey, products);

  res.json(products);
});

// @desc    Search and filter products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    mainCategory,
    subCategory,
    minPrice,
    maxPrice,
    flavor,
    shape,
    layer,
    occasion,
    festival,
    cakeType,
    eggOrEggless,
    sort,
    pageSize = 10,
    page = 1,
  } = req.query;

  // Build the query object
  const query = { isActive: true };

  // Search by keyword (in name, description, or tags)
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { tags: { $in: [new RegExp(keyword, "i")] } },
    ];
  }

  // Apply filters
  if (mainCategory) query.mainCategory = mainCategory;
  if (subCategory) query.subCategory = subCategory;
  if (flavor) query.flavor = flavor;
  if (shape) query.shape = shape;
  if (layer) query.layer = layer;
  if (occasion) query.occasion = occasion;
  if (festival && festival !== "None") query.festival = festival;
  if (cakeType && cakeType !== "Regular") query.cakeType = cakeType;
  if (eggOrEggless) query.eggOrEggless = eggOrEggless;

  // Handle backward compatibility with old category field
  if (req.query.category) {
    query.$or = [
      { mainCategory: req.query.category },
      { category: req.query.category },
    ];
  }

  // Price range
  if (minPrice && maxPrice) {
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (minPrice) {
    query.price = { $gte: Number(minPrice) };
  } else if (maxPrice) {
    query.price = { $lte: Number(maxPrice) };
  }

  // Cache key based on query parameters
  const cacheKey = `search_${JSON.stringify(
    query
  )}_${sort}_${page}_${pageSize}`;
  const cachedResults = cache.get(cacheKey);

  if (cachedResults) {
    return res.json(cachedResults);
  }

  // Sorting
  let sortOptions = {};
  if (sort === "price-low") {
    sortOptions = { price: 1 };
  } else if (sort === "price-high") {
    sortOptions = { price: -1 };
  } else if (sort === "newest") {
    sortOptions = { createdAt: -1 };
  } else if (sort === "ratings") {
    sortOptions = { avgRating: -1 };
  } else if (sort === "popularity") {
    sortOptions = { numReviews: -1 };
  } else {
    // Default sorting
    sortOptions = { createdAt: -1 };
  }

  // Pagination
  const skip = (page - 1) * pageSize;

  const products = await Product.find(query)
    .sort(sortOptions)
    .limit(Number(pageSize))
    .skip(skip);

  const totalProducts = await Product.countDocuments(query);

  const result = {
    products,
    page: Number(page),
    pages: Math.ceil(totalProducts / pageSize),
    total: totalProducts,
  };

  // Cache the results
  cache.set(cacheKey, result);

  res.json(result);
});

// @desc    Get filter options
// @route   GET /api/products/filter-options
// @access  Public
const getFilterOptions = asyncHandler(async (req, res) => {
  // Check cache first
  const cacheKey = "filter_options";
  const cachedOptions = cache.get(cacheKey);

  if (cachedOptions) {
    return res.json(cachedOptions);
  }

  // Get unique values for each filter field
  const mainCategories = await Product.distinct("mainCategory", {
    isActive: true,
  });
  const subCategories = await Product.distinct("subCategory", {
    isActive: true,
  });
  const flavors = await Product.distinct("flavor", { isActive: true });
  const shapes = await Product.distinct("shape", { isActive: true });
  const layers = await Product.distinct("layer", { isActive: true });
  const occasions = await Product.distinct("occasion", { isActive: true });
  const festivals = await Product.distinct("festival", {
    isActive: true,
    festival: { $ne: "None" },
  });
  const cakeTypes = await Product.distinct("cakeType", {
    isActive: true,
    cakeType: { $ne: "Regular" },
  });

  // Get price range
  const priceStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  const priceRange =
    priceStats.length > 0
      ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice }
      : { min: 0, max: 5000 };

  // For backward compatibility
  const categories = await Product.distinct("category", { isActive: true });

  const filterOptions = {
    mainCategories,
    subCategories,
    categories, // For backward compatibility
    flavors,
    shapes,
    layers,
    occasions,
    festivals,
    cakeTypes,
    priceRange,
    eggOrEggless: ["Egg", "Eggless"],
  };

  // Cache the results
  cache.set(cacheKey, filterOptions);

  res.json(filterOptions);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Check cache first
  const cacheKey = `product_${req.params.id}`;
  const cachedProduct = cache.get(cacheKey);

  if (cachedProduct) {
    return res.json(cachedProduct);
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    // Cache the product
    cache.set(cacheKey, product);
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
// Improved image handling for createProduct
const createProduct = asyncHandler(async (req, res) => {
  // ...existing code...

  // Initialize array to store final image URLs
  let productImages = [];

  // Process uploaded files
  if (req.files && req.files.length > 0) {
    console.log(`Processing ${req.files.length} uploaded files`);

    // For each file, upload to Cloudinary and get the URL
    for (const file of req.files) {
      try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "CakeHeaven",
        });

        // Add the secure URL to the productImages array
        productImages.push(result.secure_url);

        // Log successful upload
        console.log(`Uploaded image ${file.originalname} to Cloudinary`);
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
      }
    }
  }

  // Process image URLs from the request
  if (req.body.imageUrls) {
    try {
      // Parse the imageUrls string to an array
      const urlsArray = JSON.parse(req.body.imageUrls);

      // Validate that it's an array
      if (Array.isArray(urlsArray)) {
        console.log(`Adding ${urlsArray.length} image URLs`);

        // Add each URL to the productImages array
        productImages = [...productImages, ...urlsArray];
      } else {
        console.warn("imageUrls is not an array:", urlsArray);
      }
    } catch (error) {
      console.error("Error parsing imageUrls:", error);

      // If parsing fails, try to add it as a single string
      if (
        typeof req.body.imageUrls === "string" &&
        req.body.imageUrls.startsWith("http")
      ) {
        productImages.push(req.body.imageUrls);
      }
    }
  }

  // Validate that we have at least one image
  if (productImages.length === 0) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  // Create the product with the combined images
  const product = new Product({
    name,
    description,
    price,
    discountPrice: discountPrice || null,
    mainCategory: mainCategory || "Cakes",
    subCategory: subCategory || "Regular",
    category: mainCategory || "Cakes", // For backward compatibility
    stock: stock || 10,
    layer: layer || "One",
    images: productImages, // Use the combined array of images
    weight,
    flavor,
    shape,
    occasion,
    festival: festival || "None",
    cakeType: cakeType || "Regular",
    eggOrEggless,
    // ... rest of your code
  });

  // Save the product and return the response
  const createdProduct = await product.save();

  // Clear cache
  cache.del("all_products");
  cache.del("filter_options");

  // Log success and return
  console.log(`Product created with ${productImages.length} images`);
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Get all the fields from the request
  const {
    name,
    description,
    price,
    discountPrice,
    mainCategory,
    subCategory,
    stock,
    layer,
    weight,
    flavor,
    shape,
    occasion,
    festival,
    cakeType,
    eggOrEggless,
    customization,
    ingredients,
    nutritionalInfo,
    tags,
    featured,
    isBestSeller,
    isActive,
  } = req.body;

  // Initialize with current images (will be replaced if new images are provided)
  let updatedImages = [...product.images];
  let shouldReplaceImages = false;

  // Handle combination of uploaded files and image URLs
  const newImages = [];

  // Check if we've received any new files
  if (req.files && req.files.length > 0) {
    console.log(`Processing ${req.files.length} new uploaded files`);
    shouldReplaceImages = true;

    // Upload each file to Cloudinary
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "CakeHeaven",
        });
        newImages.push(result.secure_url);
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
      }
    }
  }

  // Check if we've received imageUrls
  if (req.body.imageUrls) {
    try {
      // Parse the imageUrls string to an array
      const urlsArray = JSON.parse(req.body.imageUrls);

      // If it's a valid array and not empty, we'll replace existing images
      if (Array.isArray(urlsArray) && urlsArray.length > 0) {
        console.log(`Processing ${urlsArray.length} image URLs`);
        shouldReplaceImages = true;

        // Add the URLs to our newImages array
        newImages.push(...urlsArray);
      }
    } catch (error) {
      console.error("Error parsing imageUrls:", error);

      // If parsing fails but it's a valid URL string, add it
      if (
        typeof req.body.imageUrls === "string" &&
        req.body.imageUrls.startsWith("http")
      ) {
        shouldReplaceImages = true;
        newImages.push(req.body.imageUrls);
      }
    }
  }

  // If we have new images to replace the old ones
  if (shouldReplaceImages) {
    console.log(`Replacing product images with ${newImages.length} new images`);

    // Delete old images from Cloudinary if they're from our domain
    for (const imgUrl of product.images) {
      if (imgUrl.includes("cloudinary.com")) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = imgUrl.split("/").pop().split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`CakeHeaven/${publicId}`);
            console.log(`Deleted old image with ID: ${publicId}`);
          }
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }
    }

    // Update with the new images
    updatedImages = newImages;
  }

  // Make sure we have at least one image
  if (updatedImages.length === 0) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  // Update all the product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price ? Number(price) : product.price;
  product.discountPrice =
    discountPrice !== undefined
      ? discountPrice === ""
        ? null
        : Number(discountPrice)
      : product.discountPrice;
  product.mainCategory = mainCategory || product.mainCategory;
  product.subCategory = subCategory || product.subCategory;
  product.category = mainCategory || product.category; // For backward compatibility
  product.stock = stock ? Number(stock) : product.stock;
  product.layer = layer || product.layer;
  product.weight = weight || product.weight;
  product.flavor = flavor || product.flavor;
  product.shape = shape || product.shape;
  product.occasion = occasion || product.occasion;
  product.festival = festival || product.festival;
  product.cakeType = cakeType || product.cakeType;
  product.eggOrEggless = eggOrEggless || product.eggOrEggless;
  product.images = updatedImages; // Set the updated images array

  // Handle complex objects that need parsing
  if (customization) {
    try {
      product.customization =
        typeof customization === "string"
          ? JSON.parse(customization)
          : customization;
    } catch (error) {
      console.error("Error parsing customization:", error);
    }
  }

  if (ingredients) {
    // Handle ingredients as array or comma-separated string
    if (typeof ingredients === "string") {
      product.ingredients = ingredients.split(",").map((item) => item.trim());
    } else if (Array.isArray(ingredients)) {
      product.ingredients = ingredients;
    }
  }

  if (nutritionalInfo) {
    try {
      product.nutritionalInfo =
        typeof nutritionalInfo === "string"
          ? JSON.parse(nutritionalInfo)
          : nutritionalInfo;
    } catch (error) {
      console.error("Error parsing nutritionalInfo:", error);
    }
  }

  if (tags) {
    // Handle tags as array or comma-separated string
    if (typeof tags === "string") {
      product.tags = tags.split(",").map((tag) => tag.trim());
    } else if (Array.isArray(tags)) {
      product.tags = tags;
    }
  }

  // Boolean fields
  if (featured !== undefined) {
    product.featured = featured === true || featured === "true";
  }

  if (isBestSeller !== undefined) {
    product.isBestSeller = isBestSeller === true || isBestSeller === "true";
  }

  if (isActive !== undefined) {
    product.isActive = isActive === true || isActive === "true";
  }

  // Save the updated product
  const updatedProduct = await product.save();

  // Clear related caches
  cache.del(`product_${req.params.id}`);
  cache.del("all_products");
  cache.del("filter_options");
  cache.del("featured_products");

  // Log success and return
  console.log(`Product updated with ${updatedImages.length} images`);
  res.json(updatedProduct);
}); 

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete images from Cloudinary
  for (const imgUrl of product.images) {
    const publicId = imgUrl.split("/").pop().split(".")[0];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`CakeHeaven/${publicId}`);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  }

  // Delete product from database
  await product.deleteOne();

  // Clear related caches
  cache.del(`product_${req.params.id}`);
  cache.del("all_products");
  cache.del("filter_options");
  cache.del("featured_products");

  res.json({ message: "Product deleted successfully" });
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user.id
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user.id,
  };

  product.reviews.push(review);

  // Update averageRating and numReviews
  await product.calculateAverageRating();

  // Clear related caches
  cache.del(`product_${req.params.id}`);
  cache.del("all_products");

  res.status(201).json({ message: "Review added", review });
});

// @desc    Update a review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find the review
  const reviewIndex = product.reviews.findIndex(
    (review) => review._id.toString() === req.params.reviewId
  );

  if (reviewIndex === -1) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if user owns the review
  if (product.reviews[reviewIndex].user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this review");
  }

  // Update review
  product.reviews[reviewIndex].rating =
    Number(rating) || product.reviews[reviewIndex].rating;
  product.reviews[reviewIndex].comment =
    comment || product.reviews[reviewIndex].comment;

  // Update averageRating and numReviews
  await product.calculateAverageRating();

  // Clear related caches
  cache.del(`product_${req.params.id}`);
  cache.del("all_products");

  res.json({ message: "Review updated", review: product.reviews[reviewIndex] });
});

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find the review
  const review = product.reviews.find(
    (review) => review._id.toString() === req.params.reviewId
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  // Remove the review
  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );

  // Update averageRating and numReviews
  await product.calculateAverageRating();

  // Clear related caches
  cache.del(`product_${req.params.id}`);
  cache.del("all_products");

  res.json({ message: "Review deleted" });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  // Check cache first
  const cacheKey = "product_categories";
  const cachedCategories = cache.get(cacheKey);

  if (cachedCategories) {
    return res.json(cachedCategories);
  }

  const mainCategories = await Product.distinct("mainCategory");
  const subCategories = await Product.distinct("subCategory");

  // For backward compatibility
  const categories = await Product.distinct("category");

  const result = {
    mainCategories,
    subCategories,
    categories,
  };

  // Cache the result
  cache.set(cacheKey, result);

  res.json(result);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  // Check cache first
  const cacheKey = "featured_products";
  const cachedProducts = cache.get(cacheKey);

  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  const limit = Number(req.query.limit) || 8;

  const featuredProducts = await Product.find({
    featured: true,
    isActive: true,
  }).limit(limit);

  // Cache the result
  cache.set(cacheKey, featuredProducts);

  res.json(featuredProducts);
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check cache first
  const cacheKey = `related_products_${req.params.id}`;
  const cachedProducts = cache.get(cacheKey);

  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  const limit = Number(req.query.limit) || 4;

  // Find products with same category or occasion or flavor
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [
      { mainCategory: product.mainCategory },
      { occasion: product.occasion },
      { flavor: product.flavor },
    ],
  }).limit(limit);

  // Cache the result
  cache.set(cacheKey, relatedProducts);

  res.json(relatedProducts);
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFilterOptions,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getProductCategories,
  getFeaturedProducts,
  getRelatedProducts,
};
