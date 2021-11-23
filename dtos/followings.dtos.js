class CommentDto {
    constructor(comment) {
        this.id = comment._id;
        this.userId = comment.userId;
        this.user = comment.followingId;
        this.postId = comment.postId;
    }
}

module.exports = CommentDto;
