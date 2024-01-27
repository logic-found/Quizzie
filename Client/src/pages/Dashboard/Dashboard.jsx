import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaEye } from "react-icons/fa";
import { getQuizListAsync } from "../../redux/quiz";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import ParseTimestamp from "../../utils/ParseTimestamp";



const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading, quizs, quizCount } = useSelector(
        (state) => state.quiz.quizList
    );
    useEffect(() => {
        dispatch(getQuizListAsync({sortBy : "impression", order : -1}));
    }, [dispatch]);

    return (
        <>
            {loading && <Spinner />}
            {!loading && (
                <div className="container">
                    <div className="d-container">
                        <Sidebar />
                        <div className="d-main-content">
                            <div className="d-main-content-inner">
                                <div className="d-main-content-one">
                                    <div className="d-main-content-heading d-h-one">
                                        {quizCount} Quiz Created
                                    </div>
                                    <div className="d-main-content-heading d-h-two">
                                        {quizs?.reduce((sum, quiz) => sum+(quiz.questions?.length || 0), 0)}{" "}
                                        Questions Created
                                    </div>
                                    <div className="d-main-content-heading d-h-three">
                                    {fomattedNumber(quizs)} Total Impressions
                                    </div>
                                </div>

                                <div className="d-main-content-two">
                                    <div className="d-main-content-two-heading">
                                        Trending Quizes
                                    </div>
                                    <div className="d-main-content-two-data">
                                        {quizs?.map((quiz, index) => (
                                            <QuizCard quiz={quiz} key={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;

const QuizCard = ({ quiz }) => {
    return (
        <div className="quizCard">
            <div className="quizCard-content1">
                <div className="quizCard-one">{quiz?.name}</div>
                <div className="quizCard-two">
                    <FaEye /> {quiz?.impression}
                </div>
            </div>
            <div className="quizCard-content2">Created On : {ParseTimestamp(quiz?.createdOn)}</div>
        </div>
    );
};


const fomattedNumber = (quizs) => {
    const number = quizs?.reduce((sum, quiz) => sum+(quiz.impression || 0), 0)
    if(number<1000) return number
    const n = ((number/1000).toFixed(1))+' K'
    return n
}