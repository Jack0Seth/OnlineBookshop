import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully', {
      icon: '📖',
      className: 'bg-[#f9f5ec] text-[#5b3e24] border border-[#a67c52] rounded-md font-serif shadow-md',
      bodyClassName: 'text-sm px-2 py-1',
      progressClassName: 'bg-[#a67c52]',
      autoClose: 3000,
    });     
    navigate('/login');
  };

  return (
    <nav className="bg-vintage-dark text-vintage-light p-4 shadow-lg border-b border-vintage-brown">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="fountain-pen-cursor flex items-center space-x-3 group">
          <i className="fas fa-book-open text-2xl text-vintage-light transition-all duration-300 group-hover:text-green-200 group-hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"></i>
          <span className="text-2xl font-bold font-serif transition-all duration-300 group-hover:text-green-200 group-hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
            Vintage Bookshop
          </span>
        </Link>

        {/* Hamburger Icon */}
        <button
          className="text-vintage-light md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-vintage-dark md:bg-transparent z-50 p-4 md:p-0 transition-all duration-300`}
        >
          <Link
            to="/"
            className="fountain-pen-cursor flex items-center space-x-2 hover:text-yellow-200 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] py-2 md:py-0"
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>

          {token ? (
            <>
              <Link
                to="/cart"
                className="fountain-pen-cursor flex items-center space-x-2 hover:text-yellow-200 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] py-2 md:py-0"
              >
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
              </Link>

              <Link
                to="/profile"
                className="fountain-pen-cursor flex items-center space-x-2 hover:text-yellow-200 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] py-2 md:py-0"
              >
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="fountain-pen-cursor flex items-center space-x-2 hover:text-red-400 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,50,50,0.8)] py-2 md:py-0"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="fountain-pen-cursor flex items-center space-x-2 hover:text-vintage-green transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(107,142,35,0.8)] py-2 md:py-0"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="fountain-pen-cursor flex items-center space-x-2 hover:text-vintage-gold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(218,165,32,0.6)] py-2 md:py-0"
              >
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
