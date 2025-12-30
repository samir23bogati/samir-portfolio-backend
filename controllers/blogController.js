import Blog from "../models/Blog.js";

// Update a blog
export const updateBlog = async (req, res) => {
  const { title, sectionOne, sectionTwo, category, author } = req.body;
  let updateData = { title, sectionOne, sectionTwo, author };

  if (category) {
    updateData.category = Array.isArray(category) ? category : category.split(',');
  }

  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    updateData.image = `data:${req.file.mimetype};base64,${b64}`;
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs with Search, Category, and Pagination
export const getBlogs = async (req, res) => {
  const { page = 1, limit = 9, search, category } = req.query;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  try {
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  const { title, sectionOne, sectionTwo, category, author } = req.body;
  let image = null;
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    image = `data:${req.file.mimetype};base64,${b64}`;
  }

  // Ensure category is stored as array
  const categoryArray = Array.isArray(category) ? category : category.split(',');

  try {
    const newBlog = new Blog({ 
      title, 
      sectionOne, 
      sectionTwo, 
      category: categoryArray, 
      author, 
      image 
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
