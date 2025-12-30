// Server entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();
const app = express();

// 1. LOGGER - MUST BE FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 2. CORS - Allow ALL for debugging
app.use(cors({
  origin: true, // Reflects the request origin (allows all)
  credentials: true
}));

// 3. DEBUG ROUTES
app.get("/", (req, res) => {
    res.send("API is running locally!");
});

app.post("/api/blogs", (req, res, next) => {
    console.log("!!! EXPLICIT POST /api/blogs MATCHED !!!");
    next(); 
});
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes

app.use("/api/blogs", blogRoutes);

// Catch-all to see what we missed
app.use((req, res) => {
    console.log(`[FALLME] 404 for ${req.method} ${req.originalUrl}`);
    res.status(404).send(`Server received request but found no route for ${req.method} ${req.originalUrl}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;