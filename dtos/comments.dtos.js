class CommentsDto {
    constructor(comment) {
        this.id = comment._id;
        this.userId = comment.userId._id;
        this.postId = comment.postId;
        this.user = comment.userId;
        this.content = comment.content;
        this.totalLikes = comment.totalLikes;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
    }
}

module.exports = CommentsDto;
