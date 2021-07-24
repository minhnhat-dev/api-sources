const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middlewares/authentication");
const { validateBody, validateQuery } = require("../validators");
const { messagesControllers } = require("../controllers");
const { messagesSchema } = require("../schemas");
require("express-async-errors");

router.use(verifyToken);
router.get("/", validateBody(messagesSchema.getList), messagesControllers.getMessages);
router.post("/", validateBody(messagesSchema.create), messagesControllers.createMessage);

module.exports = router;
