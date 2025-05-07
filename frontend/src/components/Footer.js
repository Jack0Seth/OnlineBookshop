export default function Footer() {
    return (
      <footer className="bg-vintage-dark text-vintage-light py-6 border-t border-vintage-brown">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Logo and Name */}
          <div className="flex items-center space-x-3">
            <i className="fas fa-book-open text-xl text-vintage-gold"></i>
            <span className="text-lg font-serif font-semibold">Vintage Bookshop</span>
          </div>
  
          {/* Center: Links */}
          <div className="flex space-x-6 text-sm font-medium">
            <a href="/" className="hover:text-vintage-gold transition duration-200">Home</a>
            <a href="/about" className="hover:text-vintage-gold transition duration-200">About</a>
            <a href="/contact" className="hover:text-vintage-gold transition duration-200">Contact</a>
          </div>
  
          {/* Right: Copyright */}
          <div className="text-sm text-vintage-light/70 text-center md:text-right">
            © {new Date().getFullYear()} Vintage Bookshop. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  