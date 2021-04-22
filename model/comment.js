const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    postId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        text : true
    },
});

module.exports = mongoose.model('Comment', commentSchema);