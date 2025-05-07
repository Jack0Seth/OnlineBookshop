const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  authors: {
    type: [String],
    required: true
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 9.99
  },
  stock: {
    type: Number,
    required: true,
    default: 10
  },
  categories: {
    type: [String]
  },
  pageCount: {
    type: Number,
    default: 0
  },
  publishedDate: {
    type: String
  },
  publisher: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for better performance
BookSchema.index({ title: 'text', authors: 'text', description: 'text' });
BookSchema.index({ price: 1 });
BookSchema.index({ categories: 1 });

module.exports = mongoose.model('Book', BookSchema);