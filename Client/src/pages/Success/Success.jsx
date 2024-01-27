import React, { useEffect } from "react";
import "./Success.css";
import Trophy from "../../assets/trophy.png";
import { useLocation } from "react-router-dom";

const Success = () => {
    const { correctAttempt, totalQuestion, quizType } = useLocation().state || {};
    
    return (
        <>
            {quizType === "Q & A" && (
                <div className="s-container">
                    <div className="s-inner-container">
                        <div className="s-title">
                            Congrats quiz is completed
                        </div>
                        <div className="s-trophy-section">
                            <img src={Trophy} className="s-trophy" />
                        </div>
                        <div className="s-score-section">
                            Your score is{" "}
                            <span className="s-score">
                                0{correctAttempt}/0{totalQuestion}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {quizType === "Poll" && (
                <div className="s-container">
                    <div className="s-inner-container text-poll">
                        Thank you for participating in Poll!
                    </div>
                </div>
            )}
        </>
    );
};

export default Success;
