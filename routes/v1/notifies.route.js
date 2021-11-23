const express = require("express");

const router = express.Router();
const AuthMiddleware = require("../../middlewares/authentication.middleware");
const { validateBody, validateQuery } = require("../../validators");
const { messagesControllers, NotifiesControllers } = require("../../controllers");
const { notifiesSchema } = require("../../schemas");
require("express-async-errors");

router.use(AuthMiddleware.verifyToken);
router.get("/posts/clear-notifies/", NotifiesControllers.clearPostNotify);
router.get("/posts", validateQuery(notifiesSchema.getList), NotifiesControllers.getPostNotifies);
router.post("/posts", validateBody(notifiesSchema.createPostNotify), NotifiesControllers.createPostNotify);
router.put("/posts/:id", NotifiesControllers.updatePostNotify);
router.delete("/posts/:id", NotifiesControllers.deletePostNotify);

module.exports = router;
