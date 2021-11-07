const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// Get all authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});
// New author routes
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});
// create new author route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${newAuthor}`);
  } catch {
    res.render("authors/new", {
      author: author,
      errMessage: "Error in creating author",
    });
  }
});

// Show Author and books by Author
router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  const books = await Book.find({author: author.id}).limit(6).exec();
  try{
      res.render('authors/show',{
          author: author,
          booksByAuthor : books
      })
  }catch {
      res.redirect("/");
  }
});

// render edit page
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

// Update Author name
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errMessage: "Error in creating author",
      });
    }
  }
});

// Delete Author
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
