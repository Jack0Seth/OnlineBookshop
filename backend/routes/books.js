const express = require('express');
const router = express.Router();
const axios = require('axios');
const { check, validationResult } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');  // Fixed path (removed extra dot)

// Cache setup
const cache = require('memory-cache');
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Rate limiting
const rateLimit = require('express-rate-limit');
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// @route   GET /api/books
// @desc    Get all books from database
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    //price filtering
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    //category filtering
    if (req.query.category) {
      filter.categories = { $in: [req.query.category] };
    }

    //author filtering
    if (req.query.author) {
      filter.authors = { $in: [req.query.author] };
    }

    //search query
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { authors: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    //check availability
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default sort by newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'title-asc':
          sortOption = { title: 1 };
          break;
        case 'title-desc':
          sortOption = { title: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter)
    ]);

    //const total = await Book.countDocuments();

    // Get available filter options for frontend
    const [categories, authors, priceRange] = await Promise.all([
      Book.distinct('categories'),
      Book.distinct('authors'),
      Book.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    res.json({
      books,
      total,
      page,
      pages: Math.ceil(total / limit),
      filters: {
        categories: categories.filter(c => c),
        authors: authors.filter(a => a),
        minPrice: priceRange[0]?.minPrice || 0,
        maxPrice: priceRange[0]?.maxPrice || 100
      }
    });
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/books/search
// @desc    Search books from Google Books API and save to database
// @access  Public
router.get('/search', searchLimiter, [
  check('query', 'Search query is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { query } = req.query;
    const cacheKey = `search:${query}`;
    const cached = cache.get(cacheKey);

    // Return cached results if available
    if (cached) {
      return res.json(cached);
    }

    // Fetch from Google Books API
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=20`
    );

    // Handle no results
    if (!response.data.items || response.data.items.length === 0) {
      return res.json([]);
    }

    // Process and save books
    const books = await Promise.all(
      response.data.items.map(async (item) => {
        if (!item.id || !item.volumeInfo) return null;

        const volumeInfo = item.volumeInfo;
        const bookData = {
          googleId: item.id,
          title: volumeInfo.title || 'Untitled',
          authors: volumeInfo.authors || ['Unknown Author'],
          description: volumeInfo.description || 'No description available',
          thumbnail: volumeInfo.imageLinks?.thumbnail ? 
            volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') : '',
          price: Math.floor(Math.random() * 20) + 5,
          stock: Math.floor(Math.random() * 50),
          categories: volumeInfo.categories || [],
          pageCount: volumeInfo.pageCount || 0,
          publishedDate: volumeInfo.publishedDate || '',
          publisher: volumeInfo.publisher || ''
        };

        try {
          // Upsert book in database
          const book = await Book.findOneAndUpdate(
            { googleId: item.id },
            bookData,
            { upsert: true, new: true }
          );
          return book;
        } catch (err) {
          console.error(`Error saving book ${volumeInfo.title}:`, err.message);
          return null;
        }
      })
    );

    // Filter out null results
    const validBooks = books.filter(book => book !== null);

    // Cache the results
    cache.put(cacheKey, validBooks, CACHE_DURATION);

    res.json(validBooks);
  } catch (err) {
    console.error('Book search error:', err.message);
    
    // Handle specific Google API errors
    if (err.response) {
      return res.status(err.response.status).json({ 
        error: 'Google Books API error',
        details: err.response.data.error 
      });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid book ID format' });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error('Error fetching book:', err.message);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid book ID' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST /api/books
// @desc    Create or update a book (admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  // Add admin check if needed
  // if (!req.user.isAdmin) {
  //   return res.status(403).json({ msg: 'Admin access required' });
  // }

  try {
    const { googleId, title, authors, description, price, stock } = req.body;

    const bookFields = {
      googleId,
      title,
      authors,
      description,
      price,
      stock,
      thumbnail
    };

    let book = await Book.findOne({ googleId });

    if (book) {
      // Update existing book
      book = await Book.findOneAndUpdate(
        { googleId },
        { $set: bookFields },
        { new: true }
      );
      return res.json(book);
    }

    // Create new book
    book = new Book(bookFields);
    await book.save();
    res.json(book);
  } catch (err) {
    console.error('Error saving book:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;