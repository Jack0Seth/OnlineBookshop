import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCart(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const orderData = { shippingAddress, paymentMethod };

      await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Order placed successfully');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to place order');
    }
  };

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-vintage-brown font-serif">
        <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
        <p>Loading checkout...</p>
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

  const subtotal = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * subtotal).toFixed(2));
  const totalPrice = (subtotal + shippingPrice + taxPrice).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 bg-vintage-parchment min-h-screen font-serif text-vintage-dark text-[17px] leading-relaxed">
      <h2 className="text-3xl font-bold mb-6 border-b-4 border-vintage-gold inline-block pb-1">
        <i className="fas fa-receipt mr-2"></i>
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Payment Section */}
        <div className="bg-vintage-light border-2 border-vintage-brown rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-vintage-brown border-b-2 border-vintage-gold pb-2">
            <i className="fas fa-truck mr-2"></i>
            Shipping Details
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {['address', 'city', 'postalCode', 'country'].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-semibold mb-1 capitalize text-vintage-dark">
                  <i className={`fas fa-${field === 'address' ? 'map-marker-alt' : field === 'city' ? 'city' : field === 'postalCode' ? 'envelope' : 'globe'} mr-2`}></i>
                  {field.replace('Code', ' Code')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={shippingAddress[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-vintage-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green bg-vintage-lightest font-serif"
                />
              </div>
            ))}

            <h3 className="text-2xl font-bold mb-4 text-vintage-brown border-b-2 border-vintage-gold pb-2">
              <i className="fas fa-credit-card mr-2"></i>
              Payment Method
            </h3>

            <div className="space-y-3">
              {['PayPal', 'CreditCard', 'CashOnDelivery'].map((method) => (
                <div key={method} className="flex items-center bg-vintage-lightest p-3 rounded-lg border border-vintage-light hover:border-vintage-gold transition-colors">
                  <input
                    type="radio"
                    id={method}
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="mr-3 h-5 w-5 text-vintage-green focus:ring-vintage-gold"
                  />
                  <label htmlFor={method} className="capitalize text-vintage-dark font-medium">
                    {method.replace('OnDelivery', ' on Delivery')}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-vintage-green hover:bg-vintage-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-vintage-light border-2 border-vintage-brown rounded-lg shadow-lg p-6 h-fit">
          <h3 className="text-2xl font-bold mb-4 text-vintage-brown border-b-2 border-vintage-gold pb-2">
            <i className="fas fa-clipboard-list mr-2"></i>
            Order Summary
          </h3>

          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-3 border-b border-vintage-light">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-vintage-light flex-shrink-0 border-2 border-vintage-brown rounded overflow-hidden">
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
                  <div className="ml-3">
                    <h4 className="font-semibold text-vintage-dark">{item.book.title}</h4>
                    <p className="text-sm text-vintage-brown">
                      <i className="fas fa-hashtag mr-1"></i>
                      {item.quantity} × ${item.book.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-vintage-dark">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-vintage-lightest p-4 rounded-lg border border-vintage-light">
            <div className="flex justify-between py-2">
              <span className="text-vintage-dark">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-vintage-dark">Shipping</span>
              <span className="font-semibold">${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-vintage-dark">Tax (15%)</span>
              <span className="font-semibold">${taxPrice}</span>
            </div>
            <div className="flex justify-between py-3 border-t border-vintage-light mt-2 pt-3">
              <span className="text-lg font-bold text-vintage-brown">Total</span>
              <span className="text-lg font-bold text-vintage-green">${totalPrice}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-vintage-brown">
            <i className="fas fa-lock mr-1"></i>
            Secure checkout protected by encryption
          </div>
        </div>
      </div>
    </div>
  );
}