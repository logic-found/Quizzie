import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ErrorHandler from "../utils/ErrorHandler";
import axios from "axios";
import toast from "react-hot-toast";
import queryString from "query-string";





const initialState = {
    quizCreate: {
        loading: false,
        success : false,
        quizId : null
    },
    quizList : {
        loading : false,
        quizs : null,
        quizCount : null
    },
    quizDetails : {
        loading : false,
        quiz : null
    },
    getQuiz : {
        loading : false,
        quiz : null
    },
    quizDelete : {
        loading : false,
        success : false
    },
    quizEdit : {
        loading : false,
    },
    quesAttempt : {
        loading : false,
    },
};
export const createQuizAsync = createAsyncThunk(
    "QUIZ_CREATE",
    async ({name, type, questions, timer }, thunkAPI) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/new`,
                { name, type, questions, timer  },
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const getQuizListAsync = createAsyncThunk(
    "QUIZ_LIST",
    async ({sortBy, order}, thunkAPI) => {
        try {
            const query = {}
            if(sortBy && order){
                query.sortBy = sortBy
                query.order = order
            }
            const { data } = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/quiz/all?${queryString.stringify(query)}`,
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const getQuizDetailsAsync = createAsyncThunk(
    "QUIZ_DETAILS",
    async (id, thunkAPI) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/details/${id}`,
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const getQuizAsync = createAsyncThunk(
    "QUIZ_GET",
    async (id, thunkAPI) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/${id}`,
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const deleteQuizAsync = createAsyncThunk(
    "QUIZ_DELETE",
    async (id, thunkAPI) => {
        try {
            const { data } = await axios.delete(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/${id}`,
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const updateQuesAttemptAsync = createAsyncThunk(
    "QUES_ATTEMPT_UPDATE",
    async ({selectedOptions, id}, thunkAPI) => {
        try {
            const { data } = await axios.patch(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/attemptUpdate/${id}`,
                {selectedOptions},
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const editQuizAsync = createAsyncThunk(
    "QUIZ_UPDATE",
    async ({questions, id}, thunkAPI) => {
        try {
            const { data } = await axios.patch(
                `${import.meta.env.VITE_APP_SERVER_URL}/quiz/${id}`,
                {questions},
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const QuizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers : {
        CLEAR_QUIZ_DELETE : (state) => {
            state.quizDelete.success = false
        },
        CLEAR_QUIZ_CREATE : (state) => {
            state.quizCreate.success = false
            state.quizCreate.quizId = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createQuizAsync.pending, (state) => {
                state.quizCreate.loading = true;
            })
            .addCase(createQuizAsync.fulfilled, (state, action) => {
                state.quizCreate.loading = false;
                state.quizCreate.success = true;
                state.quizCreate.quizId = action.payload.quizId;
                toast.success(action.payload?.message);
            })
            .addCase(createQuizAsync.rejected, (state, action) => {
                state.quizCreate.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(getQuizListAsync.pending, (state) => {
                state.quizList.loading = true;
            })
            .addCase(getQuizListAsync.fulfilled, (state, action) => {
                state.quizList.loading = false;
                state.quizList.quizs = action.payload.response;
                state.quizList.quizCount = action.payload.quizCount;

            })
            .addCase(getQuizListAsync.rejected, (state, action) => {
                state.quizList.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(getQuizDetailsAsync.pending, (state) => {
                state.quizDetails.loading = true;
            })
            .addCase(getQuizDetailsAsync.fulfilled, (state, action) => {
                state.quizDetails.loading = false;
                state.quizDetails.quiz = action.payload.response;
            })
            .addCase(getQuizDetailsAsync.rejected, (state, action) => {
                state.quizDetails.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(getQuizAsync.pending, (state) => {
                state.getQuiz.loading = true;
            })
            .addCase(getQuizAsync.fulfilled, (state, action) => {
                state.getQuiz.loading = false;
                state.getQuiz.quiz = action.payload.response;
            })
            .addCase(getQuizAsync.rejected, (state, action) => {
                state.getQuiz.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(deleteQuizAsync.pending, (state) => {
                state.quizDelete.loading = true;
            })
            .addCase(deleteQuizAsync.fulfilled, (state, action) => {
                state.quizDelete.loading = false;
                state.quizDelete.success = true;
                toast.success(action.payload?.message);
            })
            .addCase(deleteQuizAsync.rejected, (state, action) => {
                state.quizDelete.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(updateQuesAttemptAsync.pending, (state) => {
                state.quesAttempt.loading = true;
            })
            .addCase(updateQuesAttemptAsync.fulfilled, (state, action) => {
                state.quesAttempt.loading = false;
                console.log(action.payload?.message);
            })
            .addCase(updateQuesAttemptAsync.rejected, (state, action) => {
                state.quesAttempt.loading = false;
                console.log(action.payload);
            })
            .addCase(editQuizAsync.pending, (state) => {
                state.quizEdit.loading = true;
            })
            .addCase(editQuizAsync.fulfilled, (state, action) => {
                state.quizEdit.loading = false;
                toast.success(action.payload?.message);
            })
            .addCase(editQuizAsync.rejected, (state, action) => {
                state.quizEdit.loading = false;
                ErrorHandler(action.payload)
            })
    },
});

export default QuizSlice.reducer;
export const {CLEAR_QUIZ_DELETE, CLEAR_QUIZ_CREATE} = QuizSlice.actions