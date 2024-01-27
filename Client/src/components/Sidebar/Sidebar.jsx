import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import CreateQuiz from "../../pages/CreateQuiz/CreateQuiz";
import {useDispatch, useSelector} from 'react-redux'
import {logoutAsync, CLEAR_USER_LOGOUT} from '../../redux/user'

const Sidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading, success} = useSelector((state) => state.user.logout)
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);

    const logoutHandler = () => {
        dispatch(logoutAsync())
    }

    useEffect(() => {
        if(success){
            navigate('/')
            dispatch(CLEAR_USER_LOGOUT())
        }
    }, [success])
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
                <button className="sidebar-three"  disabled={loading} onClick={logoutHandler}>{loading? "Logging out": "Logout"}</button>
            </div>
            <CreateQuiz
                showCreateQuiz={showCreateQuiz}
                setShowCreateQuiz={setShowCreateQuiz}
            />
        </>
    );
};

export default Sidebar;
