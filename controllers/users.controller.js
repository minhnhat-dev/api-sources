/* eslint-disable radix */
const {
    validateCreateUser,
    validateUser,
    validateUpdateUser,
    validateFollowUser,
    validateUnFollowUser,
    validateCreateUserEmailPhone,
    validateRefreshToken
} = require("../validators/users.validator");
const { usersServices } = require("../services");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");
const AuthService = require("../services/auth.service");

async function createUser(req, res, next) {
    const { body } = req;
    const data = await validateCreateUser(body);
    const user = await usersServices.createUser(data);
    const payload = {
        id: user._id.toString()
    };
    const { accessToken, refreshToken } = AuthService.generateTokens(payload);
    return res.status(201).send({ user, accessToken, refreshToken });
}

async function updateUser(req, res, next) {
    const { body } = req;
    const { id } = req.params;
    const data = await validateUpdateUser(id, body);
    const user = await usersServices.updateUser(id, data);
    /* add infomation user to redis */
    req.session.user = user;
    return res.status(200).send(user);
}

async function getUsers(req, res, next) {
    const { users, total } = await usersServices.getListUsers(req.query);
    if (parseInt(req.query.is_all)) return res.status(200).send({ items: users, total });
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: users,
        total
    });
}

async function getUser(req, res, next) {
    const { id } = req.params;
    const user = await validateUser(id);
    return res.status(200).send(user);
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    const user = await validateUser(id);
    return res.status(200).send(user);
}

async function followUser(req, res, next) {
    const data = await validateFollowUser(req.body);
    const user = await usersServices.handleFollow(data);
    return res.status(200).send(user);
}

async function unfollowUser(req, res, next) {
    const data = await validateUnFollowUser(req.body);
    const user = await usersServices.handleUnFollow(data);
    return res.status(200).send(user);
}

async function getFollowers(req, res, next) {
    const { followers, total } = await usersServices.getFollowers(req.query);
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: followers,
        total
    });
}

async function getFollowings(req, res, next) {
    const { followings, total } = await usersServices.getFollowings(req.query);
    return res.status(200).send({
        skip: req.query.skip || SKIP_DEFAULT,
        limit: req.query.limit || LIMIT_DEFAULT,
        items: followings,
        total
    });
}

async function refreshTokenController(req, res, next) {
    const result = await validateRefreshToken(req.body);
    const payload = {
        userId: result.user._id,
        token: result.refreshToken
    };
    await AuthService.updateRefreshToken(payload);
    return res.status(200).send(result);
}

async function createUserEmailPhone(req, res, next) {
    const { body } = req;
    const data = await validateCreateUserEmailPhone(body);
    const user = await usersServices.createUser(data);
    return res.status(201).send(user);
}

async function logoutController(req, res, next) {
    const payload = {
        token: req.body.refreshToken
    };
    await AuthService.removeRefreshToken(payload);
    return res.status(200).send({ user: null, auth: false });
}

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUsers,
    deleteUser,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowings,
    refreshTokenController,
    createUserEmailPhone,
    logoutController
};
