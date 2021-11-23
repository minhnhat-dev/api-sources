const CreateError = require("http-errors");
const Jimp = require("jimp");
const path = require("path");

class FileHelper {
    async decodeBase64Image(image) {
        // Image Base64
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches) return "";
        if (matches.length !== 3) {
            return new Error("Invalid input string");
        }

        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        // 32478362874-3242342342343432.png
        try {
            const dest = path.join(path.resolve(`./public/storage/images/${imagePath}`));
            const jimResp = await Jimp.read(buffer);
            jimResp.resize(150, Jimp.AUTO).write(dest);
            return imagePath;
        } catch (err) {
            console.log("err", err);
            throw new CreateError.InternalServerError("error_could_not_process_the_image");
        }
    }
}

module.exports = new FileHelper();
