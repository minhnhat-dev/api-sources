const express = require("express");
const users = require("./users.route");
const login = require("./login");
const posts = require("./posts.route");
const profiles = require("./profiles");
const conversations = require("./conversations.route");
const messages = require("./messages.route");

const router = express.Router();

router.use("/api/v1", login);
router.use("/api/v1/users", users);
router.use("/api/v1/posts", posts);
router.use("/api/v1/conversations", conversations);
router.use("/api/v1/messages", messages);
// router.use('/profiles', profiles);
// router.use('/api/v1/auth', users);
module.exports = router;
