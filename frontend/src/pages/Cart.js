import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
      toast.success('Cart updated');
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? price.toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="text-center py-8 text-vintage-brown font-serif">
        <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center font-serif text-vintage-brown bg-vintage-parchment min-h-screen">
        <i className="fas fa-shopping-cart text-4xl mb-4"></i>
        <p className="text-xl mb-4">Your cart is currently empty</p>
        <Link
          to="/"
          className="bg-vintage-red hover:bg-vintage-green text-white px-6 py-2 rounded-lg shadow-md transition-colors inline-flex items-center"
        >
          <i className="fas fa-book-open mr-2"></i>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-vintage-parchment min-h-screen font-serif text-vintage-dark text-[17px] leading-relaxed">
      <h2 className="text-3xl font-bold mb-6 border-b-4 border-vintage-gold inline-block pb-1">
        <i className="fas fa-shopping-cart mr-2"></i>
        Your Cart
      </h2>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="bg-vintage-light border-2 border-vintage-brown rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="w-20 h-20 bg-vintage-light flex-shrink-0 border-2 border-vintage-brown rounded overflow-hidden">
                {item.book.thumbnail ? (
                  <img
                    src={item.book.thumbnail}
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-vintage-brown">
                    <i className="fas fa-book text-xl"></i>
                  </div>
                )}
              </div>

              <div className="ml-4 flex-grow">
              <Link
                to={`/books/${item.book._id}`}
                className="text-xl font-semibold text-vintage-brown hover:text-vintage-red transition-colors"
              >
                {item.book.title}
              </Link>

              <p className="text-base text-vintage-dark mt-1">
                <i className="fas fa-user-edit mr-1"></i>
                {item.book.authors.join(', ')}
              </p>
              <p className="text-base text-vintage-dark mt-1">
                <i className="fas fa-tag mr-1"></i>
                ${formatPrice(item.book.price)} ×{' '}
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  className="border border-vintage-dark rounded px-3 py-1 bg-[#fdf6e3] text-vintage-dark text-sm shadow-inner outline-none focus:ring-2 focus:ring-vintage-accent font-serif ml-2 transition-all duration-150"
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </p>
            </div>

              <div className="text-right font-bold text-vintage-dark min-w-[80px]">
                ${formatPrice(item.book.price * item.quantity)}
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="ml-4 text-vintage-red hover:text-vintage-brown flex items-center space-x-1 text-sm"
              >
                <i className="fas fa-trash-alt text-base"></i>
                <p>Remove</p>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t-2 border-vintage-brown pt-4">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <h3>Subtotal</h3>
          <p>${formatPrice(subtotal)}</p>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-vintage-green hover:bg-vintage-dark text-white text-center font-bold py-3 px-4 rounded-lg transition shadow-md"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
