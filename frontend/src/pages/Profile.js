import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ username: '', email: '' });

  const [editData, setEditData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setEditData({ username: userRes.data.username, email: userRes.data.email, password: '' });

        const orderRes = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(orderRes.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile/password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Password changed!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to change password');
    }
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? price.toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="text-center py-8 text-vintage-brown font-serif">
        <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
        <p>Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-vintage-parchment min-h-screen font-serif text-vintage-dark">
  
      {/* --- Edit Profile Form --- */}
      <div className="bg-vintage-light p-6 rounded-lg border border-vintage-brown mb-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-vintage-brown">
          <i className="fas fa-user-edit mr-2"></i>Edit Profile
        </h2>
        <form onSubmit={handleEditProfile} className="space-y-4">
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Current Password (required)</label>
            <input
              type="password"
              value={editData.password}
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-vintage-green text-white px-4 py-2 rounded shadow hover:bg-vintage-brown"
          >
            Save Changes
          </button>
        </form>
      </div>
  
      {/* --- Change Password Form --- */}
      <div className="bg-vintage-light p-6 rounded-lg border border-vintage-brown mb-10 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-vintage-brown">
          <i className="fas fa-key mr-2"></i>Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-medium">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full border border-vintage-brown rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-vintage-red text-white px-4 py-2 rounded shadow hover:bg-vintage-brown"
          >
            Change Password
          </button>
        </form>
      </div>
  
      {/* --- Order History Section --- */}
      <h2 className="text-3xl font-bold mb-6 border-b-4 border-vintage-gold inline-block pb-1">
        <i className="fas fa-history mr-2"></i>
        Your Orders
      </h2>
  
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-book-open text-4xl text-vintage-brown mb-4"></i>
          <p className="mb-4 text-vintage-brown text-xl">You have no orders yet</p>
          <Link
            to="/"
            className="bg-vintage-red hover:bg-vintage-green text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-300 inline-flex items-center"
          >
            <i className="fas fa-shopping-basket mr-2"></i>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-vintage-light border-2 border-vintage-brown rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="border-b-2 border-vintage-brown pb-4 mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-bold text-vintage-brown">
                      <i className="fas fa-receipt mr-2"></i>
                      Order #{order._id.substring(18, 24).toUpperCase()}
                    </h3>
                    <p className="text-sm text-vintage-dark mt-1">
                      <i className="far fa-calendar-alt mr-1"></i>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <p className="text-xs text-vintage-dark">Status</p>
                      <p className={`font-medium ${order.isDelivered ? 'text-vintage-green' : 'text-vintage-brown'}`}>
                        {order.isDelivered ? (
                          <>
                            <i className="fas fa-check-circle mr-1"></i>
                            Delivered
                          </>
                        ) : (
                          <>
                            <i className="fas fa-clock mr-1"></i>
                            Processing
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-vintage-dark">Payment</p>
                      <p className={`font-medium ${order.isPaid ? 'text-vintage-green' : 'text-vintage-red'}`}>
                        {order.isPaid ? (
                          <>
                            <i className="fas fa-check-circle mr-1"></i>
                            Paid
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times-circle mr-1"></i>
                            Pending
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg text-vintage-brown">
                    <i className="fas fa-book-open mr-2"></i>
                    Order Items
                  </h4>
                  <p className="text-lg font-bold text-vintage-dark">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center p-3 bg-white bg-opacity-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-vintage-light flex-shrink-0 border-2 border-vintage-brown rounded overflow-hidden">
                        {item.book?.thumbnail ? (
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
                          to={`/books/${item.book?._id}`}
                          className="font-medium text-vintage-brown hover:text-vintage-red transition-colors"
                        >
                          {item.book?.title || 'Unknown Book'}
                        </Link>
                        <p className="text-sm text-vintage-dark">
                          <i className="fas fa-user-edit mr-1"></i>
                          {item.book?.authors?.join(', ') || 'Unknown Author'}
                        </p>
                        <p className="text-sm text-vintage-dark">
                          <i className="fas fa-tag mr-1"></i>
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-bold text-vintage-dark">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}
