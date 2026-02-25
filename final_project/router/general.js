const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "username and password are not provided" });
  }

  if (isValid(username)) {
    return res.status(400).send({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).send({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  return res.status(200).send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooksByAuthor = Object.values(books).filter(book => book.author === author);

  if (filteredBooksByAuthor.length === 0) {
    return res.status(404).send({ message: "Books by this author not found" });
  }

  return res.status(200).send(JSON.stringify(filteredBooksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooksByTitle = Object.values(books).filter(book => book.title === title);

  if (filteredBooksByTitle.length === 0) {
    return res.status(404).send({ message: "Books with this title not found" });
  }

  return res.status(200).send(JSON.stringify(filteredBooksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
