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
  const booksList = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
    reject({ message: "Error in fetching books data" });
  });

  return booksList
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const bookDetails = new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(JSON.stringify(book, null, 4));
    } else {
      reject({ message: "Error in fetching book details" });
    }
  });

  return bookDetails
    .then(result => res.status(200).send(result))
    .catch(err => res.status(404).send(err));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
      resolve(JSON.stringify(booksByAuthor, null, 4));
    } else {
      reject({ message: "Books by this author not found" });
    }

  });

  return filteredBooksByAuthor
    .then(result => res.status(200).send(result))
    .catch(err => res.status(404).send(err));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooksByTitle = new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
      resolve(JSON.stringify(booksByTitle, null, 4));
    } else {
      reject({ message: "Books with this title not found" });
    }
  });


  return filteredBooksByTitle
    .then(result => res.status(200).send(result))
    .catch(err => res.status(404).send(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookReview = new Promise((resolve, reject) => {
    const book = books[isbn];

    if (book) {
      resolve(JSON.stringify(book.reviews, null, 4));
    } else {
      reject({ message: "Book not found" });
    }
  });

  return bookReview
    .then(result => res.status(200).send(result))
    .catch(err => res.status(404).send(err));
});

module.exports.general = public_users;
