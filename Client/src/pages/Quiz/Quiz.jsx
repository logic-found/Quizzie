import React, { useEffect, useState } from "react";
import "./Quiz.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getQuizAsync } from "../../redux/quiz";
import Spinner from "../../components/Spinner/Spinner";
import toast from "react-hot-toast";
import {updateQuesAttemptAsync} from '../../redux/quiz'

const Quiz = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, quiz } = useSelector((state) => state.quiz.getQuiz);
    const [selectedQuesNo, setSelectedQuesNo] = useState(0);
    const [correctOption, setCorrectOption] = useState(null);
    const [timer, setTimer] = useState(null);
    const [correctAttempt, setCorrectAttempt] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState([])     // choosed options

    useEffect(() => {
        dispatch(getQuizAsync(id));
    }, [dispatch]);

    useEffect(() => {
        if (quiz) {
            setTimer(Number(quiz.timer));
        }
    }, [quiz]);

    const questionSubmitHandler = async () => {
        if(timer > 0 && correctOption == null){
            toast.error("Please select correct option");
                return;
        }
        if (correctOption === quiz.questions[selectedQuesNo]?.correctOption) {
            setCorrectAttempt((prev) => prev+1)
         }
        
        setCorrectOption(null);
        setTimer(Number(quiz.timer));

        setSelectedOptions((prev) => {
            const updatedOptions = [...prev, correctOption]
            if (selectedQuesNo < quiz.questions?.length - 1) {
                setSelectedQuesNo((prev) => prev + 1);
            }else {
                navigate('/quiz/success',{ state : { correctAttempt: correctAttempt, totalQuestion: quiz.questions?.length, quizType : quiz.type }});
                dispatch(updateQuesAttemptAsync({selectedOptions : updatedOptions, id}))
            }
            return updatedOptions

        })
    };

    return (
        <>
            {loading && <Spinner />}
            {quiz && timer >= 0 && (
                <div className="q-bg">
                    <div className="q-container">
                        <div className="q-first-section">
                            <div className="q-quesNo">
                                0{selectedQuesNo + 1}/0{quiz.questions?.length}
                            </div>
                            {quiz.type === "Q & A" && quiz.timer != "off" && (
                                <Timer
                                    timer={timer}
                                    setTimer={setTimer}
                                    questionSubmitHandler={
                                        questionSubmitHandler
                                    }
                                />
                            )}
                        </div>
                        <div className="q-ques-section">
                            {quiz.questions[selectedQuesNo]?.question}
                        </div>
                        <div className="q-option-section">
                            <div className="q-option-div">
                                <Option
                                    option={
                                        quiz.questions[selectedQuesNo]
                                            ?.options[0]
                                    }
                                    index={0}
                                    optionType={
                                        quiz.questions[selectedQuesNo]
                                            ?.optionType
                                    }
                                    correctOption={correctOption}
                                    setCorrectOption={setCorrectOption}
                                />
                                <Option
                                    option={
                                        quiz.questions[selectedQuesNo]
                                            ?.options[1]
                                    }
                                    index={1}
                                    optionType={
                                        quiz.questions[selectedQuesNo]
                                            ?.optionType
                                    }
                                    correctOption={correctOption}
                                    setCorrectOption={setCorrectOption}
                                />
                            </div>
                            <div className="q-option-div">
                                {quiz.questions[selectedQuesNo]?.options
                                    .length > 2 && (
                                    <Option
                                        option={
                                            quiz.questions[selectedQuesNo]
                                                ?.options[2]
                                        }
                                        index={2}
                                        optionType={
                                            quiz.questions[selectedQuesNo]
                                                ?.optionType
                                        }
                                        correctOption={correctOption}
                                        setCorrectOption={setCorrectOption}
                                    />
                                )}
                                {quiz.questions[selectedQuesNo]?.options
                                    .length == 4 && (
                                    <Option
                                        option={
                                            quiz.questions[selectedQuesNo]
                                                ?.options[3]
                                        }
                                        index={3}
                                        optionType={
                                            quiz.questions[selectedQuesNo]
                                                ?.optionType
                                        }
                                        correctOption={correctOption}
                                        setCorrectOption={setCorrectOption}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="q-btn-section">
                            <button
                                className="btn bg-green"
                                onClick={() => questionSubmitHandler()}
                            >
                                {quiz.questions?.length - 1 === selectedQuesNo
                                    ? "Submit"
                                    : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Quiz;

const Option = ({
    option,
    index,
    optionType,
    correctOption,
    setCorrectOption,
}) => {
    return (
        <>
            <div
                className={`q-option ${
                    correctOption === index && "q-option-selected"
                }`}
                onClick={() => setCorrectOption(index)}
            >
                {optionType === "text" && option.text}
                {optionType === "imageURL" && (
                    <img src={option.imageURL || ""} className="q-option-img" />
                )}
                {optionType === "textandImageURL" && (
                    <>
                        <div className="q-option-text">{option.text}</div>
                        <img
                            src={option.imageURL || ""}
                            className="q-option-img-and-text"
                        />
                    </>
                )}
            </div>
        </>
    );
};

const Timer = ({ timer, setTimer, questionSubmitHandler }) => {
    let timeOut;
    useEffect(() => {
        if (timer > 0) {
            timeOut = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            questionSubmitHandler();
        }

        return () => clearTimeout(timeOut);
    }, [timer]);

    return (
        <>
            <div className="q-timer">00:{timer}sec</div>
        </>
    );
};