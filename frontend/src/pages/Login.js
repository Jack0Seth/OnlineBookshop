import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('Logged in successfully', {
        icon: '📖',
        className: 'bg-[#f9f5ec] text-[#5b3e24] border border-[#a67c52] rounded-md font-serif shadow-md',
        bodyClassName: 'text-sm px-2 py-1',
        progressClassName: 'bg-[#a67c52]',
        autoClose: 3000,
      });
      
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vintage-parchment font-serif px-4">
      <div className="max-w-md w-full p-8 bg-vintage-light rounded-xl shadow-lg border border-vintage-brown relative">
        {/* Decorative corner flourish */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-vintage-parchment px-4 py-1 rounded-full border border-vintage-brown shadow vintage-text-glow text-center text-vintage-brown font-semibold tracking-wide">
          Welcome Back
        </div>

        <h1 className="text-3xl font-bold text-center text-vintage-dark mt-6 mb-8">
          Sign In
        </h1>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-vintage-brown text-sm font-medium mb-2" htmlFor="email">
              <i className="fas fa-envelope mr-2 text-vintage-green"></i>Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-parchment text-vintage-dark focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
          </div>

          <div className="mb-6">
            <label className="block text-vintage-brown text-sm font-medium mb-2" htmlFor="password">
              <i className="fas fa-lock mr-2 text-vintage-green"></i>Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-parchment text-vintage-dark focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-vintage-brown hover:bg-vintage-dark text-vintage-light font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            <i className="fas fa-sign-in-alt mr-2 text-vintage-parchment"></i>Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-vintage-dark">
          Don't have an account?{' '}
          <Link to="/register" className="text-vintage-green hover:underline hover:drop-shadow-glow transition duration-200">
            Register here
          </Link>
        </p>

        <div className="mt-6 text-center text-xs italic text-vintage-brown">
          ― The charm of old books never fades ―
        </div>
      </div>
    </div>
  );
}
