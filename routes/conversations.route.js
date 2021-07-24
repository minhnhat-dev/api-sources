const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middlewares/authentication");
const { validateBody, validateQuery } = require("../validators");
const { conversationsControllers } = require("../controllers");
const { conversationsSchema } = require("../schemas");
require("express-async-errors");

router.use(verifyToken);
router.get("/", validateQuery(conversationsSchema.getList), conversationsControllers.getConversations);
router.get("/check-exists", validateQuery(conversationsSchema.checkExists), conversationsControllers.checkConversationExists);
router.get("/:id", conversationsControllers.getConversation);
router.post("/", validateBody(conversationsSchema.create), conversationsControllers.createConversation);

module.exports = router;
