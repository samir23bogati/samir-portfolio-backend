import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "../routes/blogRoutes.js";
import path from "path";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://www.samirbogati.com.np",
  "https://samirbogati.com.np",
  "https://blog-backend-final-phi.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
    res.send("Blog Backend is Running");
});

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(
    process.env.MONGO_URL || process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};


export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({
      error: "Database connection failed",
      details: error.message
    });
  }
}