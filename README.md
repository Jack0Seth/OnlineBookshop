Frontend:

First, open a new terminal and direct to frontend folder.
    cd frontend
    
Inside frontend folder, run below codes to install react node modules
    npm install

To install tailwind CSS, 
npm install tailwindcss postcss autoprefixer
Npx tailwindcss init -p

Install router dom,
    npm install react-router-dom
    
To display toast messages,
npm install react-toastify

To have fontawesome resources,
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

Configure tailwinf.config.js,
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          brown: '#8B4513',
          light: '#D2B48C',
          dark: '#5C4033',
          parchment: '#F5F5DC',
          green: '#6B8E30', // OliveDrab - vintage green
          gold: '#DAA520',  // GoldenRod - vintage gold
          red: '#B22222',  // Vintage Red
        },
      },
      boxShadow: {
        'glow': '0 0 8px rgba(210, 180, 140, 0.8)',
      },
      fontFamily: {
        'serif': ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}

Update src/index.css,
@tailwind base;
@tailwind components;
@tailwind utilities;

Backend:

Get new terminal and direct to drontend folder.
    cd backend

Inside backend folder, run following codes
    npm init -y
    npm install express

Install nodemon to keep constant development process
    npm install -g nodemon
    npm install --save-dev nodemon morgan

Install mongoose
    npm install mongoose --save
    npm install mongoose

Set .env
npm i dotenv

Create folder backend/.env and add this configuration:
MONGODB_URI=mongodb://localhost:27017/bookshop
JWT_SECRET=your_jwt_secret_here
GOOGLE_BOOKS_API_KEY=your_api_key_here
PORT=5000

Allow frontend to call backend:cors, session handling:JWT, password hashing:bcryptjs
    npm install cors jsonwebtoken bcryptjs
    npm install jwt-decode
npm install axios

Add these scripts in package.json
"scripts": {
  		"start": "node server.js",
  		"dev": "nodemon server.js",
  		"test": "jest"
}
