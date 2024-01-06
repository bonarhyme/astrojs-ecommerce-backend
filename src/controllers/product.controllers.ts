import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Product } from '../models/product.model';

/**
 * @public
 * Get request
 * @route /api/products
 *  Controller to get all paginated products
 */
export const getProducts = asyncHandler(async (req: any, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (!products.length) {
      res.status(404);
      throw new Error('Products not found');
    }

    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @public
 * GET request
 * @route /api/products/:id
 * Controller to fetch a particular product
 */
export const getProductById = asyncHandler(async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admin
 * DELETE request
 * @route /api/products/:id
 * Controller to delete a product
 * TODO: Add implementation to stop the deleting of a product
 */
export const deleteProduct = asyncHandler(async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Allow only the creator to delete the product they add
    if (req.user._id !== product.user._id) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.send({ message: 'Product removed' });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private
 * POST request
 * @route  /api/products
 * COntroller tp create a new product
 * TODO: Use multer and cloudinary for image upload
 */
export const createProduct = asyncHandler(async (req: any, res: Response) => {
  try {
    const { name, price, brand, category, countInStock, description, image } = req.body;

    if (!name || !price || !brand || !category || !countInStock || !description || !image) {
      res.status(404);
      throw new Error('Missing required fields');
    }

    const newProduct = Product.create({
      name,
      price,
      user: req.user._id,
      image,
      brand,
      category,
      countInStock,
      numReviews: 0,
      description,
    });

    if (!newProduct) {
      res.status(404);
      throw new Error('Product not created');
    }

    res.status(201).json(newProduct);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * PUT request
 * @route /api/products/:id
 * Controller to update a product
 */
export const updateProduct = asyncHandler(async (req: any, res: Response) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    if (!updateProduct) {
      res.status(500);
      throw new Error('Failed to update product');
    }
    res.status(201).json(updatedProduct);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * POST request
 * @route /api/products/:id/reviews
 * Controller to add a product review
 */
export const createProductReview = asyncHandler(async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const productUpdated = await product.save();

    if (!productUpdated) {
      res.status(400);
      throw new Error('Review failed');
    }
    res.status(201).json({ message: 'Review added' });
  } catch (error: any) {
    throw new Error(error?.message);
  }
});
