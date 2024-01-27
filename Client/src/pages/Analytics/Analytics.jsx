import React, { useState, useEffect } from "react";
import "./Analytics.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { IoMdShare as ShareIcon } from "react-icons/io";
import { FaEdit as EditIcon } from "react-icons/fa";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import  { getQuizListAsync, deleteQuizAsync, CLEAR_QUIZ_DELETE } from "../../redux/quiz";
import { useSelector, useDispatch } from "react-redux";
import ParseTimestamp from "../../utils/ParseTimestamp";
import toast from 'react-hot-toast'
import EditQuiz from "../EditQuiz/EditQuiz";







const Analytics = () => {
    const [deleteDailog, setDeleteDialog] = useState({show : false, quizId : null});
    const [editQuizDialog, setEditQuizDialog] = useState({show : false, quizId : null})
    const dispatch = useDispatch();
    const { loading, quizs} = useSelector(
        (state) => state.quiz.quizList
    );
    const { loading : deleteQuizLoading, success : deleteQuizSuccess } = useSelector(
        (state) => state.quiz.quizDelete
    );
    

    useEffect(() => {
        dispatch(getQuizListAsync({sortBy : "createdOn", order : 1}));
    }, [dispatch]);

    useEffect(() => {
        if(deleteQuizSuccess){
            dispatch(CLEAR_QUIZ_DELETE())
            setDeleteDialog({show : false, quizId : null})
        }
    }, [deleteQuizSuccess])

    const deleteQuizHandler = async() => {
        const quizId = deleteDailog.quizId
        if(quizId){
            dispatch(deleteQuizAsync(quizId))
        }
    }
    return (
        <>
            {loading && <Spinner/>}
            {!loading && <div className="a-container">
                <Sidebar />
                <div className="a-main-content">
                    <div className="a-main-content-title"> Quiz Analytics</div>
                    <div className="a-main-content-body">
                        <table className="a-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Quiz Name</th>
                                    <th>Created on</th>
                                    <th>Impression</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizs?.map((quiz, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{quiz.name}</td>
                                        <td>{ParseTimestamp(quiz.createdOn)}</td>
                                        <td>{quiz.impression}</td>
                                        <td className="a-table-row-icon">
                                            <div className="a-table-icon-edit" onClick={() => setEditQuizDialog({show : true, quizId : quiz._id})}>
                                                <EditIcon />
                                            </div>
                                            <div
                                                className="a-table-icon-delete"
                                                onClick={() =>
                                                    setDeleteDialog({show : true, quizId : quiz._id})
                                                }
                                            >
                                                <DeleteIcon />
                                            </div>
                                            <div className="a-table-icon-share" onClick={() => {
                                                      navigator.clipboard.writeText(`${import.meta.env.VITE_APP_CLIENT_URL}/quiz/${quiz._id}`);
                                                      toast.success("Link copied to clipboard!")
                                            }}>
                                                <ShareIcon />
                                            </div>
                                        </td>
                                        <td className="a-table-analysis-link">
                                            <Link to={`${quiz._id}`}>
                                                Question Wise Analysis
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
}
            {deleteDailog.show && <div className="modal-container">
                <div className="modal">
                    <div className="dd-content">
                        Are you confirm you want to delete ?
                    </div>
                    <div className="dd-btn-section">
                        <button className="btn confirm" onClick={deleteQuizHandler} disabled={deleteQuizLoading}>
                            {`${deleteQuizLoading? "Deleting...":"Confirm Delete"}`}
                        </button>
                        <button
                            className="btn"
                            onClick={() =>setDeleteDialog({show : false, quizId : null})}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>}

            {editQuizDialog.show && <EditQuiz editQuizDialog={editQuizDialog} setEditQuizDialog={setEditQuizDialog}/>}
        </>
    );
};

export default Analytics;
