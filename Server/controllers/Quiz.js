const catchAsyncError = require("../middleware/catchAsyncError");
const Quiz = require("../schema/Quiz");

exports.createQuiz = catchAsyncError(async (req, res) => {
    const user = req.user._id;
    const { questions, timer, name, type } = req.body;
    const newQuiz = new Quiz({ name, type, questions, timer, user });
    const response = await newQuiz.save();
    res.status(200).json({
        response,
        message: "Quiz Created",
        quizId: response?._id,
    });
});
exports.getQuizList = catchAsyncError(async (req, res) => {
    const id = req.user._id;
    const {sortBy, order} = req.query
    const sortCondition = {[sortBy] : Number(order)} || {}
    const response = await Quiz.find({ user: id }).sort(sortCondition);
    res.status(200).json({ response, quizCount: response?.length });
});
exports.getQuizDetails = catchAsyncError(async (req, res) => {
    const response = await Quiz.findById(req.params.id);
    if (response) {
        res.status(200).json({ response });
    } else {
        res.status(404).json({ message: "Invalid Quiz ID" });
    }
});
exports.deleteQuiz = catchAsyncError(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        const response = await quiz.deleteOne();
        if (response.deletedCount === 1) {
            res.status(200).json({ message: "Quiz deleted successfully" });
        } else {
            res.status(500).json({ message: "Failed to delete quiz" });
        }
    } else {
        res.status(404).json({ message: "Invalid Quiz ID" });
    }
});

exports.getQuiz = catchAsyncError(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        quiz.impression += 1;
        const response = await quiz.save();
        res.status(200).json({ response });
    } else {
        res.status(404).json({ message: "Invalid Quiz ID" });
    }
});

exports.updateQuiz = catchAsyncError(async(req, res) => {
    const id = req.params.id
    const {questions} = req.body
    const quiz = await Quiz.findById(id)

    if(quiz){
        const updatedQuestions= quiz.questions.map((question, index) => {
            let changed = false
            if(question.question != questions[index].question || question.correctOption != questions[index].correctOption){
                question.question = questions[index].question
                changed = true
            }
            else {
                question.options.map((option, ind) => {
                    if(question.optionType =="text" || question.optionType =="textandImageURL" ){
                        if(option.text != questions[index].options[ind].text){
                            option.text = questions[index].options[ind].text
                            changed = true
                        }
                    } 
                    if(question.optionType =="imageURL" || question.optionType =="textandImageURL" ){
                        if(option.imageURL != questions[index].options[ind].imageURL){
                            option.imageURL = questions[index].options[ind].imageURL
                            changed = true 
                        }
                    }
                })
            }
            if(changed){
                console.log('changed')
                question.totalAttempt = 0
                question.incorrectAttempt = 0
                question.correctAttempt = 0
                question.options.map((option) => {
                    option.opted = 0
                })
            }
            return question
        })
        quiz.questions = updatedQuestions
        const response = await quiz.save()
        res.status(200).json({message : "Quiz updated successfully!", response})
    }
    else{
        res.status(404).json({message : "Invalid Quiz ID"})
    }
})

exports.updateQuesAttempt = catchAsyncError(async (req, res) => {
    const { selectedOptions } = req.body; // ques that was correctly attempted
    const id = req.params.id;
    const quiz = await Quiz.findById(id);
    if (!quiz) res.status(404).json({ message: "Invalid Quiz ID" });
    else {
        if(quiz.type === "Q & A"){
            selectedOptions.map((option, index) => {
                quiz.questions[index].totalAttempt += 1
                if(!option) return
                if(option === quiz.questions[index]?.correctOption){
                    quiz.questions[index].correctAttempt += 1
                }
                else{
                    quiz.questions[index].incorrectAttempt += 1
                }
            })
        }else{
            selectedOptions.map((option, index) => {
                if(!option) return                              // represent that no option was choosen
                quiz.questions[index].options[option].opted += 1    //incorrect
            })
        }
        const response = await quiz.save()
        res.status(200).json({ message: "Updated quiz attempts" });
    }
});
