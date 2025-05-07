import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'newest',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    authors: [],
    priceRange: { min: 0, max: 100 }
  });

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await axios.get(`/api/books?${params.toString()}`);
      setBooks(res.data.books);
      setAvailableFilters({
        categories: res.data.filters?.categories || [],
        authors: res.data.filters?.authors || [],
        priceRange: {
          min: res.data.filters?.minPrice || 0,
          max: res.data.filters?.maxPrice || 100
        }
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch books');
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/books/search?query=${searchQuery}`);
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to search books');
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-vintage-parchment">
      <div className="mb-8 space-y-4">
        {/* Vintage Search Bar */}
        <div className="flex">
          <input
            type="text"
            placeholder="Search our vintage collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-vintage-brown rounded-l-lg focus:outline-none focus:ring-2 focus:ring-vintage-brown bg-vintage-light text-vintage-dark placeholder-vintage-brown"
          />
          <button
            onClick={searchBooks}
            className="bg-vintage-brown hover:bg-vintage-dark text-vintage-light px-4 py-2 rounded-r-lg transition-colors duration-300 flex items-center"
          >
            <i className="fas fa-search mr-2"></i>
            Search
          </button>
        </div>

        {/* Vintage Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sort Dropdown */}
          <div>
            <label className="block text-sm font-medium text-vintage-dark mb-1">
              <i className="fas fa-sort mr-1"></i>
              Sort By
            </label>
            <div className="w-full max-w-full overflow-x-auto">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full max-w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-light text-vintage-dark text-sm sm:text-base truncate"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-vintage-dark mb-1">
              <i className="fas fa-tags mr-1"></i>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full max-w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-light text-vintage-dark text-sm sm:text-base truncate"
            >
              <option value="">All Categories</option>
              {availableFilters.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-vintage-dark mb-1">
              <i className="fas fa-coins mr-1"></i>
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-1/2 px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-light text-vintage-dark placeholder-vintage-brown"
                min={0}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-1/2 px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-light text-vintage-dark placeholder-vintage-brown"
                max={availableFilters.priceRange.max}
              />
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="hidden peer"
            />
            <span className="w-5 h-5 inline-block border-2 border-vintage-brown rounded-sm bg-white peer-checked:bg-vintage-brown peer-checked:border-vintage-dark relative">
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </label>
            <label htmlFor="inStock" className="ml-2 block text-sm text-vintage-dark">
              <i className="fas fa-box-open mr-1"></i>
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-vintage-dark">
          <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>Loading our vintage collection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="book-vine-container">
            <div className="book-vine-left"></div>
            <div className="book-vine-bottom"></div>
          
            <div className="fountain-pen-cursor bg-vintage-light rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-vintage-brown relative z-0">
              <Link to={`/books/${book._id}`}>
                <div className="fountain-pen-cursor h-64 bg-vintage-light flex items-center justify-center relative overflow-hidden">
                  {book.thumbnail ? (
                    <img 
                      src={book.thumbnail} 
                      alt={book.title} 
                      className="fountain-pen-cursor h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="text-vintage-dark text-center p-4">
                      <i className="fas fa-book fa-4x mb-2 text-vintage-brown"></i>
                      <p>Cover Coming Soon</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-vintage-dark to-transparent h-16"></div>
                </div>
          
                <div className="fountain-pen-cursor p-4 border-t border-vintage-brown">
                  <h3 className="text-xl font-bold text-vintage-dark mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-vintage-brown mb-2">
                    <i className="fas fa-pen-nib mr-1"></i>
                    {book.authors.join(', ')}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-vintage-dark">
                      <i className="fas fa-tag mr-1"></i>
                      ${book.price.toFixed(2)}
                    </span>
                    {book.stock > 0 ? (
                      <span className="text-sm text-vintage-green">
                        <i className="fas fa-check-circle mr-1"></i>
                        In Stock
                      </span>
                    ) : (
                      <span className="text-sm text-vintage-red">
                        <i className="fas fa-times-circle mr-1"></i>
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>                 
          ))}
        </div>
      )}
    </div>
  );
}