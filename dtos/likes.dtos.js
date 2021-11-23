class LikesDto {
    constructor(like) {
        this.userId = like.userId._id;
        this.postId = like.postId;
        this.user = like.userId;
    }
}

module.exports = LikesDto;
