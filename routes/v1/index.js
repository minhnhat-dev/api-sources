const express = require("express");
const users = require("./users.route");
const login = require("./login");
const posts = require("./posts.route");
const conversations = require("./conversations.route");
const messages = require("./messages.route");
const broads = require("./broads.route");
const notifies = require("./notifies.route");

const router = express.Router();

router.use("/", login);
router.use("/users", users);
router.use("/posts", posts);
router.use("/conversations", conversations);
router.use("/messages", messages);
router.use("/broads", broads);
router.use("/notifies", notifies);
// router.use('/api/v1/auth', users);
module.exports = router;
