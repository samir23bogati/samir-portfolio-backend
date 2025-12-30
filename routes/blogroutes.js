import express from "express";
import { getBlogs, createBlog, getBlogById, updateBlog, deleteBlog } from "../controllers/blogController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Storage Configuration
// Multer Memory Storage (for Vercel/Serverless)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only!"));
  }
});

router.get("/", getBlogs);
router.post("/", upload.single("image"), createBlog);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
