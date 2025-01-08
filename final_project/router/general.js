const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password){
        return res.status(404).json({message: "Missing username and password."});
    }
    else if (!username){
        return res.status(404).json({message: "Missing username."});
    }
    else if (!password){
        return res.status(404).json({message: "Missing password."});
    }
    // Check if both username and password are provided
    else if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: `User ${username} successfully registered. You may now log in`});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let firstTime = new Date();
    let secondTime = new Date();
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(secondTime = new Date())
          },7000)
    });
    bookPromise.then(() =>
    {
        res.send(`Begun searching for book archive at ${firstTime}.
        Retrieved at ${secondTime}.
        ` + JSON.stringify(books, null, 4))
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let firstTime = new Date();
    let secondTime = new Date();
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(secondTime = new Date())
          },7000)
    });
    bookPromise.then(() =>
    {
        res.send(`Begun searching for book with ISBN number ${isbn} at ${firstTime}.
        Retrieved at ${secondTime}.
        ` + JSON.stringify(books[isbn], null, 4))
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = Object.values(books).filter((book) => book.author.toLowerCase() === author);
    let firstTime = new Date();
    let secondTime = new Date();
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(secondTime = new Date())
          },7000)
    });
    bookPromise.then(() =>
    {
        res.send(`Begun searching for books with author ${author} at ${firstTime}.
        Retrieved at ${secondTime}.
        ` + JSON.stringify(booksByAuthor, null, 4))
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = Object.values(books).filter((book) => book.title.toLowerCase().replace(/\s+/g, '') === title);
    let firstTime = new Date();
    let secondTime = new Date();
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(secondTime = new Date())
          },7000)
    });
    bookPromise.then(() =>
    {
        res.send(`Begun searching for books with titles that correspond to ${title} at ${firstTime}.
        Retrieved at ${secondTime}.
        ` + JSON.stringify(booksByTitle, null, 4))
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
