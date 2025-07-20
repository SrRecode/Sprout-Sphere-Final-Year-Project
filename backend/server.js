require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Import helmet
const connectDB = require('./config/db'); // We will create this next
const path = require('path'); // Import path module

// Connect to Database
connectDB();

const app = express();

// --- Apply Security Middleware ---
app.use(helmet()); // Apply helmet middleware early

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'], // Vite's default ports
  credentials: true
}));
app.use(express.json()); // Middleware to parse JSON bodies

// --- Serve Static Files (for uploads) ---
// Ensure the 'uploads' directory exists at the root of the backend folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.get('/', (req, res) => res.send('SproutSphere API Running...'));

// Use Auth routes
app.use('/api/auth', require('./routes/authRoutes')); // Uncommented and using the routes

// Use User routes
app.use('/api/user', require('./routes/userRoutes'));

// Mount Plant routes
app.use('/api/plants', require('./routes/plantRoutes'));

// Mount Post routes
app.use('/api/posts', require('./routes/postRoutes'));

// Mount Recommendation routes
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Mount Chat routes
app.use('/api/plant-chat', require('./routes/chatRoutes'));

// Mount AI routes
app.use('/api/ai', require('./routes/aiRoutes'));

// Mount Notification routes
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Mount Social routes
app.use('/api/social', require('./routes/socialRoutes'));

// --- ADD OTHER API ROUTES HERE (e.g., /api/recommendations) ---

// --- Global Error Handler ---
// This MUST come AFTER your routes
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5003; // Changed from 5002 to 5003

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 