import React, { useState, useEffect } from "react";
import "./EditQuiz.css";
import { editQuizAsync, getQuizDetailsAsync } from "../../redux/quiz";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import _ from "lodash";
import toast from "react-hot-toast";




const EditQuiz = ({ editQuizDialog, setEditQuizDialog }) => {
    const dispatch = useDispatch();
    const { loading: updateQuizLoading } = useSelector(
        (state) => state.quiz.quizEdit
    );
    const { loading: getQuizLoading, quiz } = useSelector(
        (state) => state.quiz.quizDetails
    );
    const [inputData, setInputData] = useState(null);
    const [selectedQuesNo, setSelectedQuesNo] = useState(0);

    useEffect(() => {
        const quizId = editQuizDialog.quizId;
        dispatch(getQuizDetailsAsync(quizId));
    }, [dispatch]);

    useEffect(() => {
        if (quiz) {
            setInputData([...quiz.questions]);
        }
    }, [quiz]);

    const setInputDataHandler = (key, value, index) => {
        const updatedInputData = _.cloneDeep(inputData);
        updatedInputData[index][key] = value;
        setInputData(updatedInputData);
    };
    const setOptionDataHandler = (value, index, optionNumber, optionType) => {
        const data = _.cloneDeep(inputData);
        data[index].options[optionNumber][optionType] = value;
        setInputData(data);
    };

    const updateHandler = (e) => {
        e.preventDefault()
        const validation = dataValidation({inputData})
        if(!validation) return
        dispatch(editQuizAsync({id : editQuizDialog.quizId, questions : inputData}))
    }

    return (
        <>
            {getQuizLoading && <Spinner />}
            {editQuizDialog.show && !getQuizLoading && inputData && (
                <div className="modal-container">
                    <div className="modal">
                        <form action="" className="eq-quiz" onSubmit={updateHandler}>
                            {/* ques count section */}
                            <div className="quiz-first-section">
                                <div className="quiz-ques-count-section">
                                    {Array.from(
                                        { length: inputData.length },
                                        (_, index) => (
                                            <div className="ques" key={index}>
                                                <div
                                                    className={`quiz-ques-count ${
                                                        selectedQuesNo ===
                                                            index &&
                                                        "quiz-ques-count-selected"
                                                    }`}
                                                    key={index}
                                                    onClick={() =>
                                                        setSelectedQuesNo(index)
                                                    }
                                                >
                                                    {index + 1}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* question */}
                            <input
                                className="quiz-question"
                                type="text"
                                placeholder="Poll Question"
                                value={inputData[selectedQuesNo]?.question}
                                onChange={(e) =>
                                    setInputDataHandler(
                                        "question",
                                        e.target.value,
                                        selectedQuesNo
                                    )
                                }
                            />

                            {/* options */}
                            <div>
                                Option Type :{" "}
                                {inputData[selectedQuesNo].optionType == "text"
                                    ? "Text"
                                    : inputData[selectedQuesNo].optionType ==
                                      "imageURL"
                                    ? "Image URL"
                                    : "Text and Image URL"}
                            </div>
                            <div className="quiz-option-section">
                                {inputData[selectedQuesNo]?.options.map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className={`quiz-option-div`}
                                        >
                                            <input
                                                type="radio"
                                                name="options"
                                                id={`option${index + 1}`}
                                                onChange={() =>
                                                    setInputDataHandler(
                                                        "correctOption",
                                                        index,
                                                        selectedQuesNo
                                                    )
                                                }
                                                checked={
                                                    inputData[selectedQuesNo]
                                                        ?.correctOption ===
                                                    index
                                                }
                                            />
                                            {(inputData[selectedQuesNo]
                                                ?.optionType === "text" ||
                                                inputData[selectedQuesNo]
                                                    ?.optionType ===
                                                    "textandImageURL") && (
                                                <input
                                                    type="text"
                                                    name=""
                                                    id={`option${index + 1}`}
                                                    className={`quiz-option ${
                                                        index ==
                                                        inputData[
                                                            selectedQuesNo
                                                        ].correctOption
                                                            ? "bg-green"
                                                            : ""
                                                    }`}
                                                    placeholder={`Text ${
                                                        index + 1
                                                    }`}
                                                    onChange={(e) =>
                                                        setOptionDataHandler(
                                                            e.target.value,
                                                            selectedQuesNo,
                                                            index,
                                                            "text"
                                                        )
                                                    }
                                                    value={
                                                        inputData[
                                                            selectedQuesNo
                                                        ]?.options[index].text
                                                    }
                                                />
                                            )}
                                            {(inputData[selectedQuesNo]
                                                ?.optionType === "imageURL" ||
                                                inputData[selectedQuesNo]
                                                    ?.optionType ===
                                                    "textandImageURL") && (
                                                <input
                                                    type="text"
                                                    name=""
                                                    id={`option${index + 1}`}
                                                    className={`quiz-option ${
                                                        index ==
                                                        inputData[
                                                            selectedQuesNo
                                                        ].correctOption
                                                            ? "bg-green"
                                                            : ""
                                                    }`}
                                                    placeholder={`Image URL ${
                                                        index + 1
                                                    }`}
                                                    onChange={(e) =>
                                                        setOptionDataHandler(
                                                            e.target.value,
                                                            selectedQuesNo,
                                                            index,
                                                            "imageURL"
                                                        )
                                                    }
                                                    value={
                                                        inputData[
                                                            selectedQuesNo
                                                        ]?.options[index]
                                                            .imageURL
                                                    }
                                                />
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* btn section */}
                            <div className="eq-btn-section">
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setEditQuizDialog({
                                            show: false,
                                            quizId: null,
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <input
                                    type="submit"
                                    value={`${
                                        updateQuizLoading
                                            ? "Updating.."
                                            : "Update Quiz"
                                    }`}
                                    className="btn btn-green"
                                    onSubmit={updateHandler}
                                    disabled={updateQuizLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditQuiz;


const dataValidation = ({inputData}) => {
    let validation = true
    inputData.map((question, index) => {
        if (!question?.question || question?.question === "") {
            toast.error(`Please enter question no ${index + 1}`);
            validation = false
            return;
        }
        for(let i=0; i<question.options?.length; ++i){
            if (
                (question.optionType === "text" &&
                    (!question.options[i]?.text || question.options[i]?.text === "")) ||
                (question.optionType === "imageURL" &&
                    (!question.options[i]?.imageURL || question.options[i]?.imageURL === "")) ||
                (question.optionType === "textandImageURL" &&
                    (!question.options[i]?.imageURL || !question.options[i]?.text || question.options[i]?.imageURL === "" || question.options[i]?.text === ""))
            ) {
                toast.error(
                    `Please enter the options for question no ${index + 1}`
                );
                validation = false
                return;
            }
        }
        if (question?.correctOption === null) {
            toast.error(
                `Please select correct option for question no ${index + 1}`
            );
            validation = false
            return;
        }
    });
    return validation
}