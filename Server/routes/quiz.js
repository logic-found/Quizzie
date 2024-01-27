const express = require('express')
const router = express.Router()
const {getQuizList, getQuizDetails, deleteQuiz, createQuiz, getQuiz, updateQuesAttempt, updateQuiz} = require('../controllers/Quiz')
const auth = require('../middleware/auth')


router 
.post('/new',auth,  createQuiz)
.get('/all',auth,  getQuizList)
.get('/details/:id', auth, getQuizDetails)
.patch('/attemptUpdate/:id', auth, updateQuesAttempt)
.patch('/:id', auth, updateQuiz)
.get('/:id', getQuiz)
.delete('/:id',auth,  deleteQuiz)



module.exports = router

