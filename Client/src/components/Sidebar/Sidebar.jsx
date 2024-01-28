import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import CreateQuiz from "../../pages/CreateQuiz/CreateQuiz";
import toast from "react-hot-toast";



const Sidebar = () => {
    const navigate = useNavigate()
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);

    const logoutHandler = () => {
        localStorage.removeItem('token')
        toast.success('Logged Out')
        navigate('/')
    }

    return (
        <>
            <div className="sidebar">
                <div className="sidebar-one title">QUIZZIE</div>
                <div className="sidebar-two">
                    <NavLink to="/dashboard" className="sidebar-two-content">
                        Dashboard
                    </NavLink>
                    <NavLink to="/analytics" className="sidebar-two-content">
                        Analytics
                    </NavLink>
                    <p
                        className="sidebar-two-content"
                        onClick={() => setShowCreateQuiz(true)}
                    >
                        Create Quiz
                    </p>
                </div>
                <button className="sidebar-three"  onClick={logoutHandler}>Logout</button>
            </div>
            <CreateQuiz
                showCreateQuiz={showCreateQuiz}
                setShowCreateQuiz={setShowCreateQuiz}
            />
        </>
    );
};

export default Sidebar;
