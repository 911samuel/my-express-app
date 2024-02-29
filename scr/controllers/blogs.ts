import { Request, Response, NextFunction } from "express";
import Blog, { IBlog } from "../models/blogs";
import { validationResult } from "express-validator";

const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find();
    res.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      error: "An error occurred while fetching blogs",
      details: error, 
    });
  }
};

const single = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, category, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const blog = new Blog({
      title,
      author,
      category,
      description,
      avatar: req.file?.path,
    });
    const savedblog = await blog.save();
    res.status(201).json({ message: "The blog was added successfully", blog: savedblog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: error }); 
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, category, description } = req.body;
  const blogId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: { title, author, category, description } },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json({
      message: `The blog was updated successfully.`,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    next(error);
  }
};

const delete1 = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  try {
    const deletedblog = await Blog.findByIdAndDelete(blogId);
    if (!deletedblog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json({ message: `The blog was deleted successfully.` });
  } catch (error) {
    console.error("Error deleting blog:", error);
    next(error);
  }
};

const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Blog.deleteMany({});
    res.status(200).json({ message: `All blogs were deleted successfully.` });
  } catch (error) {
    console.error("Error deleting all blogs:", error);
    next(error);
  }
};

export { all, single, create, update, delete1, deleteAll };
