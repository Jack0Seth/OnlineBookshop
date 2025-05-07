import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch book details');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        '/api/cart',
        { bookId: id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }          
        }
      );
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!book) {
    return <div className="text-center py-8">Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-vintage-parchment text-vintage-dark font-serif">
      <div className="bg-vintage-light rounded-lg shadow-md overflow-hidden border border-vintage-brown">
        <div className="md:flex">
          {/* Book Image */}
          <div className="md:w-1/3 p-4">
            <div className="h-64 bg-vintage-parchment flex items-center justify-center border border-vintage-brown">
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} className="h-full object-cover rounded" />
              ) : (
                <span className="text-vintage-brown italic">No image available</span>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-4xl font-bold mb-2 text-vintage-dark">{book.title}</h1>
            <p className="text-lg mb-4 italic">
              <i className="fas fa-pen-nib mr-1 text-vintage-brown"></i>
              by {book.authors.join(', ')}
            </p>
            <p className="text-2xl font-bold text-vintage-brown mb-4">
              <i className="fas fa-tag mr-1"></i>${book.price.toFixed(2)}
            </p>
            <p className="mb-6">{book.description}</p>

            {/* Quantity and Availability */}
            <div className="flex items-center mb-6">
              <label className="mr-2">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-vintage-brown bg-vintage-light text-vintage-dark rounded px-2 py-1"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <span className="ml-4 text-sm">
                {book.stock > 0 ? (
                  <span className="text-vintage-green">
                    <i className="fas fa-check-circle mr-1"></i>{book.stock} available
                  </span>
                ) : (
                  <span className="text-vintage-red">
                    <i className="fas fa-times-circle mr-1"></i>Out of stock
                  </span>
                )}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              disabled={book.stock === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 
                ${book.stock === 0 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-vintage-brown hover:bg-vintage-dark text-vintage-light'}`}
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}