const AuthService = require("../services/auth.service");
const AuthValidator = require("../validators/auth.validator");
const userService = require("../services/users.service");
const userValidator = require("../validators/users.validator");
const { STATUS, TYPES } = require("../constants/users.constant");
const { usersServices } = require("../services");

class AuthController {
    async sendOtp(req, res) {
        const { type } = req.body;
        const { phone, email } = await userValidator.validateUserEmailPhone(req.body);
        const result = await AuthService.generateHash(req.body);
        const { otp } = result;
        if (type === TYPES.PHONE) {
            /* send OTP to phone */
            // const { otp } = result;
            // await AuthService.sendBySms({ phone, otp });
        }

        if (type === TYPES.EMAIL) {
            /* send OTP to email */
            await AuthService.sendMail({ otp, email });
        }

        return res.status(200).send(result);
    }

    async verifyOtp(req, res) {
        const data = await userValidator.validateUserEmailPhone(req.body);
        AuthValidator.validateOtp(req.body);
        const newUser = await userService.createUserPhoneEmail(data);
        /* generate tokens */
        const payload = {
            id: newUser._id.toString(),
            activated: false
        };

        const { accessToken, refreshToken } = AuthService.generateTokens(payload);
        /* save refresh token */
        const refreshSave = {
            userId: newUser._id,
            token: refreshToken
        };
        await userService.storageRefreshToken(refreshSave);
        return res.status(200).send({ user: newUser, accessToken, refreshToken, auth: true });
    }

    async login(req, res) {
        const user = await userValidator.validateUserLogin(req.body);
        /* generate tokens */
        const payload = {
            id: user._id.toString()
        };

        const { accessToken, refreshToken } = AuthService.generateTokens(payload);
        /* save refresh token */
        const refreshSave = {
            userId: user._id,
            token: refreshToken
        };
        await userService.storageRefreshToken(refreshSave);
        return res.status(200).send({ user, accessToken, refreshToken, auth: true });
    }

    async register(req, res) {
        const data = await userValidator.validateCreateUser(req.body);
        const user = await usersServices.createUser(data);
        /* generate tokens */
        const payload = {
            id: user._id.toString()
        };

        const { accessToken, refreshToken } = AuthService.generateTokens(payload);
        /* save refresh token */
        const refreshSave = {
            userId: user._id,
            token: refreshToken
        };
        await userService.storageRefreshToken(refreshSave);
        return res.status(200).send({ user, accessToken, refreshToken, auth: true });
    }

    async logout(req, res) {
        const { refreshToken } = req.body;
        await userValidator.validateLogout(req.body);
        const payload = {
            token: refreshToken
        };
        await AuthService.removeRefreshToken(payload);
        return res.status(200).send({ user: null, auth: false });
    }
}

module.exports = new AuthController();
