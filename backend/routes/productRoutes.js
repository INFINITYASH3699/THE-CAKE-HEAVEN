import express from "express";
import {
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
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - mainCategory
 *         - layer
 *         - weight
 *         - flavor
 *         - shape
 *         - occasion
 *         - eggOrEggless
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the product
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Detailed product description
 *         price:
 *           type: number
 *           description: Regular price
 *         discountPrice:
 *           type: number
 *           description: Discounted price (if applicable)
 *         mainCategory:
 *           type: string
 *           description: Main category (Cakes, Cup-Cakes, Pastry, Desserts)
 *           enum: [Cakes, Cup-Cakes, Pastry, Desserts]
 *         subCategory:
 *           type: string
 *           description: Subcategory
 *           enum: [Regular, Trending Cakes, Unique Cakes, Featured Cakes]
 *         stock:
 *           type: number
 *           description: Available stock
 *         layer:
 *           type: string
 *           description: Number of layers
 *           enum: [One, Two, Three]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to product images
 *         weight:
 *           type: string
 *           description: Weight of the cake (e.g., "500g", "1kg")
 *         flavor:
 *           type: string
 *           description: Flavor of the cake
 *           enum: [Chocolate, Blueberry, Pineapple, Fresh Fruit, Red Velvet, Vanilla, Butterscotch, Other]
 *         shape:
 *           type: string
 *           description: Shape of the cake
 *           enum: [Square, Circle, Heart, Tall, Other]
 *         occasion:
 *           type: string
 *           description: Occasion the cake is suited for
 *           enum: [Birthday, Anniversary, Wedding, Baby Shower, Engagement, Mother's Day, Father's Day, Other]
 *         festival:
 *           type: string
 *           description: Festival theme (if applicable)
 *         cakeType:
 *           type: string
 *           description: Special cake type
 *         eggOrEggless:
 *           type: string
 *           description: Whether the cake contains egg
 *           enum: [Egg, Eggless]
 *         avgRating:
 *           type: number
 *           description: Average rating
 *         numReviews:
 *           type: number
 *           description: Number of reviews
 *         featured:
 *           type: boolean
 *           description: Whether the product is featured
 *         isBestSeller:
 *           type: boolean
 *           description: Whether the product is a bestseller
 *         isActive:
 *           type: boolean
 *           description: Whether the product is active and should be displayed
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the review
 *         user:
 *           type: string
 *           description: User ID of the reviewer
 *         name:
 *           type: string
 *           description: Name of the reviewer
 *         rating:
 *           type: number
 *           description: Rating (1-5)
 *         comment:
 *           type: string
 *           description: Review comment
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all active products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search and filter products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: mainCategory
 *         schema:
 *           type: string
 *         description: Filter by main category
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Filter by subcategory
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: flavor
 *         schema:
 *           type: string
 *         description: Filter by flavor
 *       - in: query
 *         name: shape
 *         schema:
 *           type: string
 *         description: Filter by shape
 *       - in: query
 *         name: layer
 *         schema:
 *           type: string
 *         description: Filter by layer
 *       - in: query
 *         name: occasion
 *         schema:
 *           type: string
 *         description: Filter by occasion
 *       - in: query
 *         name: festival
 *         schema:
 *           type: string
 *         description: Filter by festival
 *       - in: query
 *         name: cakeType
 *         schema:
 *           type: string
 *         description: Filter by cake type
 *       - in: query
 *         name: eggOrEggless
 *         schema:
 *           type: string
 *         description: Filter by egg or eggless
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-low, price-high, newest, ratings, popularity]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Filtered product list with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/products/filter-options:
 *   get:
 *     summary: Get filter options for product search
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Available filter options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mainCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 subCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 flavors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 shapes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 layers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 occasions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 festivals:
 *                   type: array
 *                   items:
 *                     type: string
 *                 cakeTypes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 priceRange:
 *                   type: object
 *                   properties:
 *                     min:
 *                       type: number
 *                     max:
 *                       type: number
 */
router.get("/filter-options", getFilterOptions);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mainCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 subCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: For backward compatibility
 */
router.get("/categories", getProductCategories);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Number of featured products to return
 *     responses:
 *       200:
 *         description: List of featured products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/featured", getFeaturedProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products/{id}/related:
 *   get:
 *     summary: Get related products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of related products to return
 *     responses:
 *       200:
 *         description: List of related products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id/related", getRelatedProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - mainCategory
 *               - layer
 *               - weight
 *               - flavor
 *               - shape
 *               - occasion
 *               - eggOrEggless
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               mainCategory:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               stock:
 *                 type: number
 *               layer:
 *                 type: string
 *               weight:
 *                 type: string
 *               flavor:
 *                 type: string
 *               shape:
 *                 type: string
 *               occasion:
 *                 type: string
 *               festival:
 *                 type: string
 *               cakeType:
 *                 type: string
 *               eggOrEggless:
 *                 type: string
 *               customization:
 *                 type: string
 *                 description: JSON string of customization options
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               nutritionalInfo:
 *                 type: string
 *                 description: JSON string of nutritional information
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *               isBestSeller:
 *                 type: boolean
 *               imageUrls:
 *                 type: string
 *                 description: JSON string array of image URLs
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin access required
 */
router.post("/", protect, admin, upload.array("images", 5), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               mainCategory:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               stock:
 *                 type: number
 *               layer:
 *                 type: string
 *               weight:
 *                 type: string
 *               flavor:
 *                 type: string
 *               shape:
 *                 type: string
 *               occasion:
 *                 type: string
 *               festival:
 *                 type: string
 *               cakeType:
 *                 type: string
 *               eggOrEggless:
 *                 type: string
 *               customization:
 *                 type: string
 *                 description: JSON string of customization options
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               nutritionalInfo:
 *                 type: string
 *                 description: JSON string of nutritional information
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *               isBestSeller:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               imageUrls:
 *                 type: string
 *                 description: JSON string array of image URLs
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin access required
 *       404:
 *         description: Product not found
 */
router.delete("/:id", protect, admin, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Create a product review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review added"
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Product already reviewed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/:id/reviews", protect, createProductReview);

/**
 * @swagger
 * /api/products/{id}/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating
 *               comment:
 *                 type: string
 *                 description: Updated comment
 *     responses:
 *       200:
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review updated"
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Product or review not found
 */
router.put("/:id/reviews/:reviewId", protect, updateProductReview);

/**
 * @swagger
 * /api/products/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Product or review not found
 */
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

export default router;
