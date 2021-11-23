/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const axios = require("axios");
const faker = require("faker");

const profilePicture = {
    0: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-5.jpg",
    1: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-2.jpg",
    2: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-9.png",
    3: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-3.jpg",
    4: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-4.jpg",
    5: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088462/covers/avatar-default-6.jpg",
    6: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-7.jpg",
    7: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-8.jpg",
    8: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-11.jpg",
    9: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-12.jpg",
    10: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-14.jpg",
    11: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-10.jpg",
    12: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088461/covers/avatar-default-17.jpg",
    13: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088460/covers/avatar-default-13.jpg",
    14: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088460/covers/avatar-default-16.jpg",
    15: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088460/covers/avatar-default-1.jpg",
    16: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1630088460/covers/avatar-default-15.jpg",
    17: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629916863/covers/image-10.jpg",
    18: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629916863/covers/image-9.jpg",
    19: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629916862/covers/image-8.jpg",
    20: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629915808/covers/image-5.jpg",
    21: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629915621/covers/image-1.jpg",
    22: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629915809/covers/image-6.jpg",
    23: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629915810/covers/image-7.jpg",
    24: "https://res.cloudinary.com/dcbejjfw2/image/upload/v1629915621/covers/image-4.jpg"
};
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createInputUser() {
    const gender = Math.floor((Math.random() * 2) + 1);
    const relationship = Math.floor((Math.random() * 3) + 1);
    const number = Math.floor((Math.random() * 24) + 1);
    const profilePicturePick = profilePicture[number];
    const user = {
        name: faker.internet.userName(),
        username: faker.internet.userName() + Math.floor((Math.random() * 999) + 1),
        phone: faker.phone.phoneNumber(),
        password: "123",
        passwordConfirm: "123",
        from: faker.address.country(),
        city: faker.address.cityName(),
        description: faker.name.jobDescriptor(),
        email: faker.internet.email(),
        gender,
        relationship
    };
    return user;
}

async function main(params) {
    const numberUsers = 50;
    const userIds = [];
    const config = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Cookie: "connect.sid=s%3ACRKpVOk9PT969bUftm0hRBryJW-jKOD1.bgajkt19AKiosJdMJyGEygeiA8FyuDiVyR8Fi0GDHC8",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjkyZjU0ZWEzYzVhYTQzMzZhOGRiNSIsImFjdGl2YXRlZCI6ZmFsc2UsImlhdCI6MTYzMDUwMTEwMSwiZXhwIjoxNjMwNTg3NTAxfQ.qEEJnFr5bxHNaem3cAxaAYywJVm0CGeyOc2dfIMFIKQ"
        }
    };

    const configRegister = { ...config };
    configRegister.url = "http://localhost:3000/api/v1/users/auth/register";

    const configFollow = { ...config };
    configFollow.url = "http://localhost:3000/api/v1/users/follow";
    configFollow.method = "put";

    for (let index = 0; index < numberUsers; index += 1) {
        try {
            const user = createInputUser();
            configRegister.data = JSON.stringify(user);
            const { data = {} } = await axios(configRegister);
            await timeout(500);
            if (data.user) {
                const body = {
                    userId: "61309e5de019870dc0f16202",
                    followerId: data.user.id
                };
                console.log("body", body);
                configFollow.data = JSON.stringify(body);
                await axios(configFollow);
            }
            console.log("index", index);
        } catch (error) {
            console.error("+createUser() error", error.message);
            continue;
        }
    }
}

main();
