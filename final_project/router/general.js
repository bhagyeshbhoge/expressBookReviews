const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists. Please choose another." });
    }

    // If username is unique, create a new user
    const newUser = {
        username: username,
        password: password // Note: In a real application, ensure to hash passwords!
    };

    // Add the new user to the users array
    users.push(newUser);

    // Respond with success message
    return res.status(201).json({ message: "User registered successfully!" });
});

//task 1
// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     //Write your code here
//     return res.status(200).json(books);
// });

// task 10
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     //Write your code here
//     const isbn = req.params.isbn;

//     // Check if the book with the provided key exists in the books object
//     const book = books[isbn];

//     if (book) {
//         return res.status(200).json(book); // Return the book details if found
//     } else {
//         return res.status(404).json({ message: "Book not found" }); // Return a 404 if the book isn't found
//     }
// });

//  Task 11
// Get book details based on ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     const author = req.params.author;

//     // Obtain all the keys for the 'books' object (if 'books' is an array, this is not necessary)
//     const bookArray = Array.isArray(books) ? books : Object.values(books);

//     // Filter the books that match the provided author
//     const matchedBooks = bookArray.filter(b => b.author === author);

//     // Check if any books are found
//     if (matchedBooks.length > 0) {
//         return res.status(200).json(matchedBooks); // Return the matched books
//     } else {
//         return res.status(404).json({ message: "No books found for the specified author" }); // Return a 404 if no books are found
//     }
// });

//  Task 12
//  Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getBooks()
        .then((bookEntries) => Object.values(bookEntries))
        .then((books) => books.filter((book) => book.author === author))
        .then((filteredBooks) => res.send(filteredBooks));
});


// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//     const title = req.params.title;

//     // Obtain all the keys for the 'books' object (if 'books' is an array, this is not necessary)
//     const bookArray = Array.isArray(books) ? books : Object.values(books);

//     // Filter the books that match the provided title
//     const matchedBooks = bookArray.filter(b => b.title.toLowerCase() === title.toLowerCase());

//     // Check if any books are found
//     if (matchedBooks.length > 0) {
//         return res.status(200).json(matchedBooks); // Return the matched books
//     } else {
//         return res.status(404).json({ message: "No books found for the specified title" }); // Return a 404 if no books are found
//     }
// });

//   Task 13
//  Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBooks()
        .then((bookEntries) => Object.values(bookEntries))
        .then((books) => books.filter((book) => book.title === title))
        .then((filteredBooks) => res.send(filteredBooks));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    // Check if the book with the provided key exists in the books object
    const book = books[isbn];

    // Check if the book exists and has reviews
    if (book) {
        // Return the reviews or a message if there are none
        return res.status(200).json(book.reviews || { message: "No reviews available for this book." });
    } else {
        return res.status(404).json({ message: "Book not found." }); // Return a 404 if the book isn't found
    }
});

module.exports.general = public_users;
