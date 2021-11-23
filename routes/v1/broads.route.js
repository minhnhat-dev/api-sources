const express = require("express");

const router = express.Router();
const AuthMiddleware = require("../../middlewares/authentication.middleware");
const { validateBody, validateQuery } = require("../../validators");
const { BroadsControllers } = require("../../controllers");
const { broadsSchema } = require("../../schemas");
require("express-async-errors");

router.get("/", validateQuery(broadsSchema.getList), BroadsControllers.getBroads);
router.use(AuthMiddleware.verifyToken);
router.post("/", validateBody(broadsSchema.create), BroadsControllers.createBroad);
router.put("/:id", validateBody(broadsSchema.update), BroadsControllers.updateBroad);
router.delete("/:id", BroadsControllers.deleteBroad);

module.exports = router;
