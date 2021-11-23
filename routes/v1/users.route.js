const express = require("express");

const router = express.Router();
const { validateBody, validateQuery } = require("../../validators");
const { usersControllers } = require("../../controllers");
const { usersSchema } = require("../../schemas");
const AuthController = require("../../controllers/auth.controller");
const AuthMiddlewares = require("../../middlewares/authentication.middleware");
require("express-async-errors");

router.post("/auth/send-otp", validateBody(usersSchema.sendOtp), AuthController.sendOtp);
router.post("/auth/verify-otp", validateBody(usersSchema.verifyOtp), AuthController.verifyOtp);
router.post("/auth/register", validateBody(usersSchema.create), AuthController.register);
router.post("/auth/login", validateBody(usersSchema.login), AuthController.login);
router.post("/auth/logout", validateBody(usersSchema.logout), AuthController.logout);
router.post("/auth/refresh-token", validateBody(usersSchema.refreshToken), usersControllers.refreshTokenController);
router.get("/", validateQuery(usersSchema.getList), usersControllers.getUsers);
router.get("/followings/", usersControllers.getFollowings);
router.get("/followers/", usersControllers.getFollowers);
router.get("/:id/", usersControllers.getUser);

router.use(AuthMiddlewares.verifyToken);
router.put("/follow/", validateBody(usersSchema.follow), usersControllers.followUser);
router.put("/unfollow/", validateBody(usersSchema.unFollow), usersControllers.unfollowUser);
router.put("/:id", validateBody(usersSchema.update), usersControllers.updateUser);
router.delete("/:id", usersControllers.deleteUser);
router.post("/", validateBody(usersSchema.createUserEmailPhone), usersControllers.createUserEmailPhone);

module.exports = router;
