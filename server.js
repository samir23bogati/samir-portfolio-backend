// Server entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogroutes.js";

dotenv.config();
const app = express();

// 1. LOGGER - MUST BE FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 2. CORS - Configure for production
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.samirbogati.com.np',
    'https://samirbogati.com.np'
  ],
  credentials: true
}));

// 3. Body parser
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 4. DEBUG ROUTES
app.get("/", (req, res) => {
    res.send("API is running!");
});

app.post("/api/blogs", (req, res, next) => {
    console.log("!!! EXPLICIT POST /api/blogs MATCHED !!!");
    next(); 
});

// 5. API Routes
app.use("/api/blogs", blogRoutes);

// Catch-all 404
app.use((req, res) => {
    console.log(`[FALLBACK] 404 for ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      error: "Not Found",
      message: `No route found for ${req.method} ${req.originalUrl}`
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Start server (only in development, Vercel handles this in production)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
export default app;