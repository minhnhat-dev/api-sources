const express = require("express");

const router = express.Router();
const AuthMiddleware = require("../../middlewares/authentication.middleware");
const { validateBody, validateQuery } = require("../../validators");
const { postsControllers } = require("../../controllers");
const { postsSchema } = require("../../schemas");
const upload = require("../../middlewares/upload-files.middleware");
require("express-async-errors");

router.get("/", validateQuery(postsSchema.getList), postsControllers.getPosts);
router.get("/images", validateQuery(postsSchema.getList), postsControllers.getPostImages);
router.get("/:id/likes", validateQuery(postsSchema.getLikesPost), postsControllers.getLikesPost);
router.get("/:id", postsControllers.getPost);
router.use(AuthMiddleware.verifyToken);
router.post("/", validateBody(postsSchema.create), postsControllers.createPost);
router.get("/upload/", postsControllers.getImagesUpload);
router.post("/upload", upload.single("image"), postsControllers.uploadImage);
router.get("/timeline/", validateQuery(postsSchema.getTimeline), postsControllers.getTimelineByUserId);
router.put("/:id", validateBody(postsSchema.update), postsControllers.updatePost);
router.get("/:id/is-like", postsControllers.checkIsLike);
router.put("/:id/like", validateBody(postsSchema.likePost), postsControllers.likePost);
router.put("/:id/unlike", validateBody(postsSchema.unlikePost), postsControllers.unlikePost);
router.get("/:id/comments", validateBody(postsSchema.getComments), postsControllers.getComments);
router.post("/:id/comments", validateBody(postsSchema.createComment), postsControllers.createComment);
router.put("/:id/comments/:commentId/", postsControllers.updateComment);
router.delete("/:id/comments/:commentId/", postsControllers.deleteComment);
router.delete("/:id/comments/", postsControllers.deletePostComment);
router.post("/:id/comments/:commentId/like", validateBody(postsSchema.likeComment), postsControllers.likeComment);
router.post("/:id/comments/:commentId/unlike", validateBody(postsSchema.likeComment), postsControllers.unlikeComment);
router.get("/:id/comments/:commentId/is-like", postsControllers.checkIsLikeComment);
router.delete("/upload/", postsControllers.deleteImage);
router.delete("/:id", postsControllers.deletePost);

module.exports = router;
