import {configureStore, combineReducers} from '@reduxjs/toolkit'
import User from './user'
import Quiz from './quiz'

const rootReducer = combineReducers({
    user : User,
    quiz : Quiz
})

export const store = configureStore({
    reducer : rootReducer
})

