require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const router = require('./Routes/router');

const app = express();

// 🔌 Connect to MongoDB
connectToMongo();

// 🔧 Middleware
app.use(cors({
  origin: "https://quickmart-frontend-s35m.onrender.com", // ✅ no trailing slash
  credentials: true
}));

app.use(express.json());

// 📦 API Routes
app.use('/api', router); // ✅ prefix all routes with /api

// 🚀 Server Listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
