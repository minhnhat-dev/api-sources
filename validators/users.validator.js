const axios = require("axios");
const CreateError = require("http-errors");
const faker = require("faker");
const { userConstant } = require("../constants");
const { Users, Followings, RefreshTokens } = require("../datasources/mongodb/models");
const { signAccessToken, signRefreshToken } = require("../middlewares/authentication.middleware");
const { ERROR_CODES, TYPES } = require("../constants/users.constant");
const FileHelper = require("../helpers/files.helper");
const AuthService = require("../services/auth.service");
const { STATUS } = require("../constants/followings.constant");
const { getAllFollowings } = require("../services/users.service");

async function validateAccessTokenFaceBook(body) {
    /* Get account id */
    const { accessToken } = body;

    if (!accessToken) throw new CreateError.Unauthorized("Unauthorized");

    const graphFacebookUrl = `${userConstant.GRAPH_FACEBOOK_URL}/me?access_token=${accessToken}`;
    const { data: userFacebook } = await axios.get(graphFacebookUrl);
    const { name, id } = userFacebook;

    if (!id) throw new CreateError.Unauthorized("Unauthorized");

    let user = null;
    user = await Users.findOne({ facebookId: id }).lean();

    if (!user) {
        const newUser = new Users({ name, facebookId: id });
        newUser.roles = ["Normal"];
        newUser.email = `${id}@gmail.com`;
        newUser.setPassword(faker.random.uuid());
        await newUser.save();
        user = newUser;
    }

    return {
        token: signAccessToken(user),
        user
    };
}

async function validateCreateUser(body) {
    const { email, password, passwordConfirm } = body;
    if (password !== passwordConfirm) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_CONFIRM_NOT_MATCH);
    }

    const countEmail = await Users.countDocuments({ email });
    if (countEmail) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_ALREADY_EXISTS);
    }

    return body;
}

async function validateUserLogin(body) {
    const { email, password } = body;

    let user = await Users.findOne({ email });

    if (!user) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const isCorrect = await user.validatePassword(password);

    if (!isCorrect) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_INVALID);
    }
    /* get all followings id */
    const followings = await getAllFollowings(user._id);
    user = user.toObject();
    user.followings = followings;
    return user;
}

async function validateUser(id, isGetFollowings = true) {
    const user = await Users.findById(id).lean();

    if (!user) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }
    /* get all followings id */
    if (isGetFollowings) {
        const followings = await getAllFollowings(user._id);
        user.followings = followings;
    }

    return user;
}

async function validateUpdateUser(id, body) {
    const { coverPicture } = body;
    const user = await validateUser(id);
    if (coverPicture) body.activated = true;
    return body;
}

async function validateFollowUser(body) {
    const { userId, followerId } = body;

    if (userId === followerId) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_FOLLOW_YOURSELF);
    }

    const user = await validateUser(userId);
    const userFollwer = await validateUser(followerId);

    if (!userFollwer) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const countUserFollowing = await Followings.countDocuments({
        userId,
        followingId: followerId
    });

    if (countUserFollowing) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_ALREADY_FOLLOW_THIS);
    }

    return body;
}

async function validateUnFollowUser(body) {
    const { userId, unFollowerId } = body;

    if (userId === unFollowerId) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_UNFOLLOW_YOURSELF);
    }

    const user = await validateUser(userId);
    const userUnFollwer = await validateUser(unFollowerId);

    if (!userUnFollwer) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND);
    }

    const countUserFollowing = await Followings.countDocuments({
        userId,
        followingId: unFollowerId
    });

    if (!countUserFollowing) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_FOLLOW_YET);
    }

    return body;
}

async function validateUserEmailPhone(body) {
    const { type, email, phone } = body;
    const newBody = { type };

    if (type === TYPES.EMAIL && !email) throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_IS_REQUIRED);
    if (type === TYPES.PHONE && !phone) throw new CreateError.BadRequest(ERROR_CODES.ERROR_PHONE_IS_REQUIRED);

    if (type === TYPES.EMAIL && email) {
        const countEmail = await Users.countDocuments({ email });
        if (countEmail) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_ALREADY_EXISTS);
        }
        newBody.email = email;
    }

    if (type === TYPES.PHONE && phone) {
        const countPhone = await Users.countDocuments({ phone });
        if (countPhone) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_PHONE_ALREADY_EXISTS);
        }
        newBody.phone = phone;
    }

    return newBody;
}

async function validateRefreshToken(body) {
    const { refreshToken } = body;
    const userData = await AuthService.verifyRefreshToken(refreshToken);
    const { id: userId } = userData;
    const token = await RefreshTokens.findOne({ userId, token: refreshToken }).lean();
    if (!token) throw new CreateError.Unauthorized("error_token_invalid");
    const user = await Users.findOne({ _id: userId }).lean();
    if (!user) throw new CreateError.NotFound("error_user_not_found");
    /* generate tokens */
    const payload = {
        id: userId,
        activated: false
    };
    /* get all followings id */
    const followings = await getAllFollowings(user._id);
    user.followings = followings;
    const { accessToken, refreshToken: newRefreshToken } = AuthService.generateTokens(payload);

    return { user, accessToken, refreshToken: newRefreshToken, auth: true };
}

async function validateLogout(body) {
    const { refreshToken } = body;
    const token = await RefreshTokens.findOne({ token: refreshToken }).lean();
    if (!token) throw new CreateError.Unauthorized("error_token_invalid");
    return token;
}

module.exports = {
    validateAccessTokenFaceBook,
    validateCreateUser,
    validateUserLogin,
    validateUser,
    validateUpdateUser,
    validateFollowUser,
    validateUnFollowUser,
    validateUserEmailPhone,
    validateRefreshToken,
    validateLogout
};
