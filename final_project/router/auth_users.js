const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find(user => user.username === username);

  if (user && user.length > 0) {
    return true;
  }

  return false;
}

const authenticatedUser = (username, password) => {
  const user = users.filter(user => user.username === username && user.password === password);

  if (user && user.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "username and password are not provided" });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };

    return res.status(200).send({ message: "User successfully logged in" });

  } else {
    return res.status(401).send({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  const username = req.session.authorization.username;
  const usersReview = book.reviews[username];
  const newReview = req.body.review;

  book.reviews[username] = newReview;

  if (usersReview) {
    return res.status(200).send({ message: "Review updated successfully" });
  } else {
    return res.status(200).send({ message: "Review added successfully" });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization.username;

  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).send({ message: "Review deleted successfully" });
  } else {
    return res.status(404).send({ message: "Cannot delete review." });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
