const express = require("express");
const router = express.Router();
const users = require("../ROUTE/user.js");

//Index - users
router.get("/", (req, res) => {
    res.send("GET for users");
});

//SHOW - users
router.get("/:id", (req, res)=> {
    res.send("GET for user id");
});

//post - users
router.post("/", (req, res) => {
    res.send("post for users")
});

//delete - users
router.delete("/:id", (req, res) => {
    res.send("DELETE for post user id")
});


module.exports = router;