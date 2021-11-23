/* eslint-disable radix */
const fs = require("fs");
const path = require("path");

const { validateCreateConversation, validateConversation } = require("../validators/conversation.validator");
const { validateUser } = require("../validators/users.validator");
const { conversationsServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createConversation(req, res, next) {
    const { body } = req;
    const data = await validateCreateConversation(body);
    const conversation = await conversationsServices.createConversation(data);
    const conversationPopulate = conversation.populate("members").execPopulate();
    console.log("conversationPopulate", conversationPopulate);
    return res.status(201).send(conversation);
}

async function getConversations(req, res, next) {
    const { conversations, total } = await conversationsServices.getListConversations(req.query);
    if (req.query.isAll) return res.status(200).send({ items: conversations, total });
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: conversations,
        total
    });
}

async function getConversation(req, res, next) {
    const { id } = req.params;
    const conversation = await validateConversation(id);
    return res.status(200).send(conversation);
}

async function checkConversationExists(req, res, next) {
    const result = await conversationsServices.checkConversationExists(req.query);
    return res.status(200).send(result);
}

// async function updatePost(req, res, next) {
//     const { body } = req;
//     const { id } = req.params;
//     const data = await validateUpdatePost(id, body);
//     const post = await postsServices.updatePost(id, data);
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
    createConversation,
    getConversations,
    getConversation,
    checkConversationExists
};
