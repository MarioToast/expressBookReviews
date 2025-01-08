const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let existingUsernames = users.filter((user) => user.username === username);
    if (existingUsernames.length > 0){
        return false;
    }
    else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let theUser = users.filter((user) => user.username === username);
    if (theUser[0]){
        if (password === theUser[0].password){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
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

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let review = req.body.review;
    let isbn = req.params.isbn;
    let username = req.body.username;

    if (books[isbn]){
        books[isbn].reviews[username] ={review};
        let bookTitle = books[isbn].title;
        return res.send(`Review added for ${bookTitle}: ${review}`);
    }
    else{
        return res.send("Please input a valid ISBN number");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.body.username;
    if (books[isbn]){
        delete books[isbn].reviews[username];
        return res.send(`Deleted review from ${username}`);
    }
    else{
        return res.send("Please input a valid ISBN number");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
