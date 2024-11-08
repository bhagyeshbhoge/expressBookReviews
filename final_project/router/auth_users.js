const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => users.some(user => user.username === username);

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password; // Check for matching password
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username exists and authenticate
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create a JWT token
  const accessToken = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

  // Send token back to client
  return res.status(200).json({ message: "Login successful!", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body; // Get review from request body
  const username = req.session?.authorization?.username; // Get username from session

  // Check if username is available
  if (!username) {
    return res.status(403).json({ message: "User not authenticated." });
  }

  // Validate input
  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }

  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the specified ISBN and username
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully.", reviews: books[isbn].reviews });
});

// //  Task 9
// //  Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  }
  else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
