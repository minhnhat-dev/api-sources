const CreateError = require("http-errors");
const AuthService = require("../services/auth.service");

class AuthMiddlewares {
    async verifyToken(req, res, next) {
        try {
            const authorization = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
            const token = authorization.split(" ")[1];
            if (!token) throw new CreateError.Unauthorized("error_unauthorized");
            /* Verify access token */
            const user = await AuthService.verifyAccessToken(token);
            req.user = user;
            next();
        } catch (err) {
            console.error("VerifyToken Err", err);
            const error = new CreateError.Unauthorized("error_token_invalid");
            next(error);
        }
    }
}

module.exports = new AuthMiddlewares();
