const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Please enter user id"],
    },
    name: { type: String, required: [true, "Please enter quiz name"] },
    type: { type: String, required: [true, "Please enter quiz type"] },
    createdOn: { type: Date, default: Date.now },
    impression: {
        type: Number,
        required: [true, "Please enter quiz impression"],
        default : 0
    },
    timer: { type: String, required: [true, "Please enter quiz timer"]},
    questions: {
        type: [
            {
                question: {
                    type: String,
                    required: [true, "Please enter atleast 1 quiz question"],
                },
                optionType: {
                    type: String,
                    required: [true, "Please enter quiz question option type"],
                },
                options: {
                    type: [{
                        text: {
                            type: String
                        },
                        imageURL: {
                            type: String
                        },
                        opted : {
                            type : Number,
                            default : 0
                        }
                    }],
                    required: [true, "Please enter quiz options"],
                },
                correctOption: {
                    type: Number,
                    required: [
                        true,
                        "Please enter quiz question correct option index number",
                    ],
                },
                correctAttempt: { type: Number, default : 0 },
                incorrectAttempt : {type: Number, default : 0},
                totalAttempt: { type: Number, default : 0 },
            },
        ],
        required: [true, "Please enter quiz question"],
    },
});


module.exports = mongoose.model('Quiz', schema)
