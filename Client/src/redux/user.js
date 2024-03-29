import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ErrorHandler from "../utils/ErrorHandler";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
    register: {
        loading: false,
        success : false
    },
    login: {
        loading: false,
        success : false
    }
};

const setToken = (token) => {
    localStorage.setItem('token', token);
}
export const registerAsync = createAsyncThunk(
    "REGISTER",
    async ({ name, email, password }, thunkAPI) => {
        try {        
            const { data } = await axios.post(
                `${import.meta.env.VITE_APP_SERVER_URL}/user/register`,
                { name, email, password },
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const loginAsync = createAsyncThunk(
    "LOGIN",
    async ({ email, password }, thunkAPI) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_APP_SERVER_URL}/user/login`,
                { email, password },
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);




const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        CLEAR_USER_REGISTER : (state) => {
            state.register.success = false
        },
        CLEAR_USER_LOGIN : (state) => {
            state.login.success = false
        },
        CLEAR_USER_LOGOUT : (state) => {
            state.logout.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerAsync.pending, (state) => {
                state.register.loading = true;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.register.loading = false;
                state.register.success = true;
                setToken(action.payload.token)
                toast.success(action.payload?.message);
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.register.loading = false;
                ErrorHandler(action.payload);
            })
            .addCase(loginAsync.pending, (state) => {
                state.login.loading = true;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.login.loading = false;
                state.login.success = true;
                setToken(action.payload.token)
                toast.success(action.payload?.message);
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.login.loading = false;
                ErrorHandler(action.payload);
            })
    },
});

export default UserSlice.reducer;
export const {CLEAR_USER_LOGIN, CLEAR_USER_REGISTER} = UserSlice.actions
