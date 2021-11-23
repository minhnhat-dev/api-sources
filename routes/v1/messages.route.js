const express = require("express");

const router = express.Router();
const AuthMiddleware = require("../../middlewares/authentication.middleware");
const { validateBody, validateQuery } = require("../../validators");
const { messagesControllers } = require("../../controllers");
const { messagesSchema } = require("../../schemas");
require("express-async-errors");

router.use(AuthMiddleware.verifyToken);
router.get("/", validateBody(messagesSchema.getList), messagesControllers.getMessages);
router.post("/", validateBody(messagesSchema.create), messagesControllers.createMessage);

module.exports = router;
