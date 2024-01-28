const express = require('express')
const app = express()
const connectDB = require('./connectDB')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const UserRouter = require('./routes/user')
const QuizRouter = require('./routes/quiz')
const port = process.env.PORT || 8000
require('dotenv').config();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))

app.use('/api/user', UserRouter)
app.use('/api/quiz', QuizRouter)
app.get('/api', (req, res) => {
    res.json("working fine")
})

app.listen(port, () => {
    console.log("server started")
    connectDB()
})
app.get('/', (req, res) => {
    res.json("server running")
})

