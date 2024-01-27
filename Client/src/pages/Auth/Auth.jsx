import React, { useEffect, useState } from "react";
import "./Auth.css";
import {registerAsync, loginAsync, CLEAR_USER_LOGIN, CLEAR_USER_REGISTER} from '../../redux/user'
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'



const Auth = () => {
    const [openForm, setOpenForm] = useState('signUp')
    return (
        <>
            <div className="container">
                <div className="auth-inner-container">
                    <div className="title">QUIZZIE</div>
                    <div className="auth-btn-section">
                        <button className={`auth-btn ${(openForm === "signUp")? "auth-btn-active":""}`} onClick={() => setOpenForm('signUp')}>Sign Up</button>
                        <button className={`auth-btn ${(openForm === "logIn")? "auth-btn-active":""}`} onClick={() => setOpenForm('logIn')}>Log In</button>
                    </div>
                    <div className="auth-form-section">
                        {(openForm === "signUp")? <SignUp/>:<LogIn/> }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;

const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading, success} = useSelector((state) => state.user.register)
    const [inputData, setInputData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [inputDataError, setInputDataError] = useState({
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    const setInputDataHandler = (key, value) => {
        setInputData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const formValidation = ({ inputData, setInputDataError }) => {
        let validation = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const setError = (key, condition, errorMessage) => {
            if (condition) {
                setInputDataError((prevState) => ({
                    ...prevState,
                    [key]: errorMessage,
                }));
                validation = false;
            } else {
                setInputDataError((prevState) => ({
                    ...prevState,
                    [key]: null,
                }));
            }
        };

        setError(
            "email",
            !emailRegex.test(inputData.email),
            "Please enter a valid email"
        );
        setError(
            "name",
            !isNaN(inputData.name),
            "Name must contain only alphabets"
        );
        setError(
            "password",
            inputData.password?.length < 4,
            "Password must contain 4 characters"
        );
        setError(
            "confirmPassword",
            inputData.password !== inputData.confirmPassword,
            "Passwords do not match"
        );

        return validation;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let validation = formValidation({ inputData, setInputDataError });
        if (!validation) return;
        dispatch(registerAsync({ name : inputData.name, email : inputData.email, password : inputData.password }))
    };


    useEffect(() => {
        if(success){
            navigate('/dashboard')
            dispatch(CLEAR_USER_REGISTER())
        }
    }, [success])

    return (
        <>
            <div className="">
                <form action="" className="auth-form" onSubmit={submitHandler}>
                    <div className="auth-form-field">
                        <label htmlFor="name" className="auth-form-label">
                            Name
                        </label>
                        <div className="">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="auth-form-input"
                                required
                                maxLength={20}
                                value={inputData.name}
                                onChange={(e) =>
                                    setInputDataHandler("name", e.target.value)
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.name}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="email" className="auth-form-label">
                            Email
                        </label>
                        <div className="">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="auth-form-input"
                                required
                                maxLength={30}
                                value={inputData.email}
                                onChange={(e) =>
                                    setInputDataHandler("email", e.target.value)
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.email}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="password" className="auth-form-label">
                            Password
                        </label>
                        <div className="">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="auth-form-input"
                                required
                                maxLength={15}
                                value={inputData.password}
                                onChange={(e) =>
                                    setInputDataHandler(
                                        "password",
                                        e.target.value
                                    )
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.password}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-field">
                        <label
                            htmlFor="confirmPassword"
                            className="auth-form-label"
                        >
                            Confirm Password
                        </label>
                        <div className="">
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="auth-form-input"
                                maxLength={15}
                                required
                                value={inputData.confirmPassword}
                                onChange={(e) =>
                                    setInputDataHandler(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.confirmPassword}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-btn-section">
                        <input
                            type="submit"
                            className="auth-btn auth-form-btn"
                            value={`${loading? "Signing In...":"Sign In"}`}
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};





const LogIn = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading, success} = useSelector((state) => state.user.login)
    const [inputData, setInputData] = useState({
        email: "",
        password: "",
    });
    const [inputDataError, setInputDataError] = useState({
        email: null,
        password: null,
    });

    const setInputDataHandler = (key, value) => {
        setInputData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const formValidation = ({ inputData, setInputDataError }) => {
        let validation = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const setError = (key, condition, errorMessage) => {
            if (condition) {
                setInputDataError((prevState) => ({
                    ...prevState,
                    [key]: errorMessage,
                }));
                validation = false;
            } else {
                setInputDataError((prevState) => ({
                    ...prevState,
                    [key]: null,
                }));
            }
        };
        setError(
            "email",
            !emailRegex.test(inputData.email),
            "Please enter a valid email"
        );
        return validation;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let validation = formValidation({ inputData, setInputDataError });
        if (!validation) return;
        dispatch(loginAsync({email : inputData.email, password : inputData.password}))
    };

    useEffect(() => {
        if(success){
            navigate('/dashboard')
            dispatch(CLEAR_USER_LOGIN())
        }
    }, [success])


    return (
        <>
            <div className="">
                <form action="" className="auth-form" onSubmit={submitHandler}>
                    <div className="auth-form-field">
                        <label htmlFor="email" className="auth-form-label">
                            Email
                        </label>
                        <div className="">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="auth-form-input"
                                required
                                maxLength={30}
                                value={inputData.email}
                                onChange={(e) =>
                                    setInputDataHandler("email", e.target.value)
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.email}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="password" className="auth-form-label">
                            Password
                        </label>
                        <div className="">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="auth-form-input"
                                required
                                maxLength={15}
                                value={inputData.password}
                                onChange={(e) =>
                                    setInputDataHandler(
                                        "password",
                                        e.target.value
                                    )
                                }
                            />
                            <p className="auth-input-error">
                                {inputDataError.password}
                            </p>
                        </div>
                    </div>
                    <div className="auth-form-btn-section">
                        <input
                            type="submit"
                            className="auth-btn auth-form-btn"
                            value={`${loading? "Signing In...":"Sign In"}`}
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};
