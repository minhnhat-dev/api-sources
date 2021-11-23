const CreateError = require("http-errors");
const { Users } = require("../datasources/mongodb/models");
const AuthService = require("../services/auth.service");
const { TYPES } = require("../constants/users.constant");

class AuthValidator {
    validateOtp(body) {
        const { otp, hash, phone, email, type } = body;
        const key = type === TYPES.PHONE ? phone : email;
        const [hashedOtp, expires] = hash.split(".");

        if (Date.now() > +expires) throw new CreateError.BadRequest("OTP expired!");
        const data = `${key}.${otp}.${expires}`;
        const isValid = this.verifyOtp({ hashedOtp, data });
        if (!isValid) throw new CreateError.BadRequest("Invalid OTP");
        return isValid;
    }

    verifyOtp({ hashedOtp, data }) {
        const computedHash = AuthService.hashOtp(data);
        return computedHash === hashedOtp;
    }

    async validatePhone(body) {
        const { phone } = body;
        const user = await Users.findOne({ phone });
        if (user) throw new CreateError.BadRequest("Phone already exists !");
        return true;
    }
}

module.exports = new AuthValidator();
