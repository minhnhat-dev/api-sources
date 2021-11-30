const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const CreateError = require("http-errors");

const HASH_SECRET = process.env.HASH_SECRET || "324{sd}hass4fh";

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "24h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1y";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";
// const twilio = require("twilio")(smsSid, smsAuthToken, {
//     lazyLoading: true
// });
const mailer = require("../helpers/mailer.helper");
const { TYPES } = require("../constants/users.constant");
const { RefreshTokens } = require("../datasources/mongodb/models");

class AuthService {
    async generateHash(body) {
        const { email, phone, type } = body;
        const key = type === TYPES.PHONE ? phone : email;
        const otp = await this.generateOtp();
        const ttl = 1000 * 60 * 5; // 5 min
        const expires = Date.now() + ttl;
        const data = `${key}.${otp}.${expires}`;
        const hash = this.hashOtp(data);

        return {
            hash: `${hash}.${expires}`,
            phone,
            otp,
            email,
            type
        };
    }

    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    hashOtp(data) {
        return crypto
            .createHmac("sha256", HASH_SECRET)
            .update(data)
            .digest("hex");
    }

    async sendBySms({ phone, otp }) {
        /* tài khoản miễn phí phải verify mobile mới gửi được */
        /* note sđt xác minh đầu tiên nó k gửi message đc */
        // const result = await twilio.messages.create({
        //     to: phone,
        //     from: process.env.SMS_FROM_NUMBER,
        //     body: `Your minhnhat.dev OTP is ${otp}`
        // });
        // return result;
    }

    async sendMail({ otp, email }) {
        const to = email;
        const subject = "minhnhat.dev OTP 🎉";
        const payload = { otp };
        const result = await mailer.sendMail({ to, subject, payload });
        return result;
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: accessTokenLife
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: refreshTokenLife
        });
        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, refreshTokenSecret);
    }

    async updateRefreshToken(payload) {
        const { userId, token } = payload;
        return RefreshTokens.updateOne({ userId }, { token });
    }

    async removeRefreshToken(payload) {
        const { token } = payload;
        return RefreshTokens.deleteOne({ token });
    }
}

module.exports = new AuthService();
