import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./QuestionAnalysis.css";
import Spinner from "../../components/Spinner/Spinner";
import { getQuizDetailsAsync } from "../../redux/quiz";
import { useSelector, useDispatch } from "react-redux";
import ParseTimestamp from "../../utils/ParseTimestamp";
import { useParams } from "react-router-dom";

const QuizAnalysis = ({}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, quiz } = useSelector((state) => state.quiz.quizDetails);
    useEffect(() => {
        dispatch(getQuizDetailsAsync(id));
    }, [dispatch]);

    
    return (
        <>
            {loading && <Spinner />}
            {quiz && (
                <div className="container">
                    <div className="qa-container">
                        <Sidebar />
                        <div className="qa-main-content">
                            <div className="qa-main-content-top">
                                <div className="qa-main-content-title">
                                    {quiz.name} Question Analysis
                                </div>
                                <div className="qa-main-content-sider">
                                    <p>
                                        Created On :{" "}
                                        {ParseTimestamp(quiz.createdOn)}
                                    </p>
                                    <p>Impression : {quiz.impression}</p>
                                </div>
                            </div>

                            <div className="qa-main-content-body">
                                {quiz.questions?.map((question, index) => (
                                    <div className="qa-ques-card">
                                        <div className="qa-ques">
                                            Ques {index + 1}:{" "}
                                            {question.question}
                                        </div>
                                        <div className="qa-sol">
                                            {quiz.type === "Q & A" && (
                                                <>
                                                    <Card
                                                        title={
                                                            question.totalAttempt ||
                                                            0
                                                        }
                                                        content={
                                                            "People Attempted the question"
                                                        }
                                                    />
                                                    <Card
                                                        title={
                                                            question.correctAttempt ||
                                                            0
                                                        }
                                                        content={
                                                            "People Answered Correctly"
                                                        }
                                                    />
                                                    <Card
                                                        title={question.incorrectAttempt
                                                        }
                                                        content={
                                                            "People Answered Incorrectly"
                                                        }
                                                    />
                                                </>
                                            )}
                                            {quiz.type === "Poll" && <>
                                            {question.options.map((option, index) => (
                                                <>
                                                <Card title={option.opted} content={`Option ${index+1}`}/>
                                                </>
                                            ))}
                                            
                                            </>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizAnalysis;

const Card = ({ title, content }) => {
    return (
        <div className="qa-card">
            <div className="qa-card-title">{title}</div>
            <div className="qa-card-body">{content}</div>
        </div>
    );
};
