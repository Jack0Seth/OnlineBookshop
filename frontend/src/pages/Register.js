import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('Registered successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vintage-parchment font-serif px-4">
      <div className="max-w-md w-full p-8 bg-vintage-light rounded-xl shadow-lg border border-vintage-brown relative">
        {/* Decorative ribbon */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-vintage-parchment px-4 py-1 rounded-full border border-vintage-brown shadow text-vintage-brown font-semibold tracking-wide">
          Create Your Account
        </div>

        <h1 className="text-3xl font-bold text-center text-vintage-dark mt-6 mb-8">
          Register
        </h1>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-vintage-brown text-sm font-medium mb-2" htmlFor="username">
              <i className="fas fa-user mr-2 text-vintage-green"></i>Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-parchment text-vintage-dark focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
          </div>

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
              minLength="6"
              className="w-full px-3 py-2 border border-vintage-brown rounded-lg bg-vintage-parchment text-vintage-dark focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-vintage-brown hover:bg-vintage-dark text-vintage-light font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            <i className="fas fa-user-plus mr-2 text-vintage-parchment"></i>Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-vintage-dark">
          Already have an account?{' '}
          <Link to="/login" className="text-vintage-green hover:underline hover:drop-shadow-glow transition duration-200">
            Sign In
          </Link>
        </p>

        <div className="mt-6 text-center text-xs italic text-vintage-brown">
          ― A new chapter begins with a single click ―
        </div>
      </div>
    </div>
  );
}
