const nodeMailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const adminEmail = ADMIN_EMAIL || "your_email@gmail.com";
const adminPassword = ADMIN_PASSWORD || "your_password";
const mailHost = "smtp.gmail.com";
const mailPort = 587;

const sendMail = async ({ to, subject, payload }) => {
    const { otp } = payload;
    const html = await fs.readFileSync(path.resolve("./templates/otp.template.html"), { encoding: "utf8" });
    const template = handlebars.compile(html);
    const data = { otp };
    const htmlToSend = template(data);
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });

    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to, // địa chỉ gửi đến
        subject, // Tiêu đề của mail
        html: htmlToSend // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    };

    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options);
};

module.exports = {
    sendMail
};
