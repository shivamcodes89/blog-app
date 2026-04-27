const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const protect = require('../middleware/auth');

// ─── CREATE BLOG ────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.create({
      title,
      content,
      author: req.user.id
    });

    res.json(blog);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET ALL MY BLOGS ───────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    // Only fetch blogs that belong to logged-in user
    const blogs = await Blog.find({ author: req.user.id });

    res.json(blogs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET SINGLE BLOG ────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Make sure the blog belongs to the logged-in user
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json(blog);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPDATE BLOG ────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Make sure the blog belongs to the logged-in user
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Update the fields
    blog.title = title;
    blog.content = content;
    await blog.save();

    res.json(blog);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE BLOG ────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Make sure the blog belongs to the logged-in user
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await blog.deleteOne();

    res.json({ message: 'Blog deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;