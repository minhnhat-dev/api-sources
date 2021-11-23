/* eslint-disable radix */
const fs = require("fs");
const path = require("path");

const { validateCreateMessage } = require("../validators/messages.validator");
const { validateUser } = require("../validators/users.validator");
const { messagesServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createMessage(req, res, next) {
    const { body } = req;
    const data = await validateCreateMessage(body);
    const message = await messagesServices.createMessage(data);
    return res.status(201).send(message);
}

async function getMessages(req, res, next) {
    const { messages, total } = await messagesServices.getListMessages(req.query);
    if (req.query.isAll) return res.status(200).send({ items: messages, total });
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: messages,
        total
    });
}

// async function updatePost(req, res, next) {
//     const { body } = req;
//     const { id } = req.params;
//     const data = await validateUpdatePost(id, body);
//     const post = await postsServices.updatePost(id, data);
//     return res.status(200).send(post);
// }

// async function getPost(req, res, next) {
//     const { id } = req.params;
//     const post = await validatePost(id);
//     return res.status(200).send(post);
// }

// async function deletePost(req, res, next) {
//     const { id } = req.params;
//     await validatePost(id);
//     await postsServices.deletePost(id);
//     return res.status(204).send();
// }

// async function likePost(req, res, next) {
//     const { id } = req.params;
//     await validateLikePost(id, req.body);
//     const post = await postsServices.likePost(id, req.body);
//     return res.status(200).send(post);
// }

// async function unlikePost(req, res, next) {
//     const { id } = req.params;
//     await validateUnLikePost(id, req.body);
//     const post = await postsServices.unlikePost(id, req.body);
//     return res.status(200).send(post);
// }

// async function getTimelineByUserId(req, res, next) {
//     const { userId } = req.query;
//     const user = await validateUser(userId);
//     req.body.user = user;
//     const { posts, total } = await postsServices.getTimelineByUserId(req.query);
//     return res.status(200).send({
//         skip: req.query.skip || SKIP_DEFAULT,
//         limit: req.query.limit || LIMIT_DEFAULT,
//         items: posts,
//         total
//     });
// }

// async function checkIsLike(req, res, next) {
//     const { id } = req.params;
//     const { userId } = req.query;
//     await validatePost(id);
//     const isLike = await postsServices.checkIsLikePost(id, userId);
//     return res.status(200).send({ isLike });
// }

// function uploadImage(req, res) {
//     return res.status(201).send({ file: req.file });
// }

// async function deleteImage(req, res) {
//     const { file } = req.body;
//     const { path: pathFile } = file;
//     const pathDelete = path.resolve(pathFile);

//     if (pathDelete) {
//         await fs.unlinkSync(pathDelete);
//     }

//     return res.status(204).send();
// }

// async function getImagesUpload(req, res) {
//     const pathFile = path.resolve("public/storage/images");
//     const files = [];
//     fs.readdirSync(pathFile).forEach((file) => {
//         files.push(file);
//     });
//     return res.status(200).send({ items: files });
// }

module.exports = {
    createMessage,
    getMessages
};
