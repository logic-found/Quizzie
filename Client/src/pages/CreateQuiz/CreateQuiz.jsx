import React, { useEffect, useState } from "react";
import "./CreateQuiz.css";
import toast from "react-hot-toast";
import { FaPlus as PlusIcon } from "react-icons/fa";
import { RxCross1 as CrossIcon } from "react-icons/rx";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { createQuizAsync, CLEAR_QUIZ_CREATE } from "../../redux/quiz";

const CreateQuiz = ({ showCreateQuiz, setShowCreateQuiz }) => {
    const [showQuizNameTypePanel, setShowQuizNameTypePanel] = useState(true);
    const [showQuizQuesPanel, setShowQuizQuesPanel] = useState(false);
    const [showCreateQuizSuccessPanel, setShowCreateQuizSuccessPanel] =
        useState(false);
    const dispatch = useDispatch();
    const { loading, quizId, success } = useSelector(
        (state) => state.quiz.quizCreate
    );
    const [quizData, setQuizData] = useState({
        name: "",
        type: null,
    });
    const [inputData, setInputData] = useState([
        {
            question: "",
            optionType: "text",
            options: [
                { text: "", imageURL: "" , opted:0},
                { text: "", imageURL: "" , opted:0},
            ],
            correctOption: null,
        },
    ]);
    const [timer, setTimer] = useState(5);
    const [selectedQuesNo, setSelectedQuesNo] = useState(0);
    const [quizLink, setQuizLink] = useState("");




    // -----------------   methods   ----------------
    const quizNameTypeSubmitHandler = () => {
        if (quizData.name === "" || !quizData.type) {
            toast.error("Please enter Quiz name & type to proceed");
            return;
        } else {
            setShowQuizNameTypePanel(false);
            setShowQuizQuesPanel(true);
        }
    };

    const setInputDataHandler = (key, value, index) => {
        const updatedInputData = [...inputData];
        updatedInputData[index][key] = value;
        setInputData(updatedInputData);
    };
    const setOptionDataHandler = (value, index, optionNumber, optionType) => {
        const data = [...inputData];
        data[index].options[optionNumber][optionType] = value;
        setInputData(data);
    };
    const addQuestionHandler = () => {
        setInputData((prevState) => [
            ...prevState,
            {
                question: "",
                optionType: "text",
                options: [
                    { text: "", imageURL: "" , opted:0},
                    { text: "", imageURL: "" , opted:0},
                ],
                correctOption: null,
            },
        ]);
        setSelectedQuesNo(selectedQuesNo + 1);
    };
    const removeQuestionHandler = (index) => {
        if (selectedQuesNo >= index) setSelectedQuesNo(selectedQuesNo - 1);
        const data = inputData.filter((_, i) => i != index);
        setInputData(data);
    };

    const addOptionHandler = () => {
        
        if (inputData[selectedQuesNo].options.length < 4) {
            const data = [...inputData];
            data[selectedQuesNo].options = [
                ...data[selectedQuesNo].options,
                { text: "", imageURL: "" , opted:0},
            ];
            setInputData(data);
        }
    };
    const deleteOptionHandler = (index) => {
        const data = [...inputData];
        data[selectedQuesNo].options = data[selectedQuesNo].options.filter(
            (_, ind) => ind != index
        );
        setInputData(data);
    };

    const createQuizSubmitHandler = (e) => {
        e.preventDefault();
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
        if(!validation) return
        dispatch(
            createQuizAsync({
                name: quizData.name,
                type: quizData.type,
                questions: inputData,
                timer,
            })
        );
    };

    useEffect(() => {
        if (success && quizId) {
            setQuizLink(
                `${import.meta.env.VITE_APP_CLIENT_URL}/quiz/${quizId}`
            );
            dispatch(CLEAR_QUIZ_CREATE());
            setShowQuizQuesPanel(false);
            setShowCreateQuizSuccessPanel(true);
        }
    }, [success, quizId]);






    
    return (
        <>
            {showCreateQuiz && (
                <div className="modal-container">
                    <div className="modal">
                        {/* Quiz name & type panel */}
                        {showQuizNameTypePanel && (
                            <>
                                <input
                                    type="text"
                                    className="createQuiz-name"
                                    placeholder="Quiz Name"
                                    value={quizData.name}
                                    onChange={(e) =>
                                        setQuizData((prevState) => ({
                                            ...prevState,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                                <div className="createQuiz-type">
                                    <p>Quiz Type : </p>
                                    <button
                                        className={`btn ${
                                            quizData.type === "Q & A" &&
                                            "btn-green"
                                        }`}
                                        onClick={() =>
                                            setQuizData((prevState) => ({
                                                ...prevState,
                                                type: "Q & A",
                                            }))
                                        }
                                    >
                                        Q & A
                                    </button>
                                    <button
                                        className={`btn ${
                                            quizData.type === "Poll" &&
                                            "btn-green"
                                        }`}
                                        onClick={() =>
                                            setQuizData((prevState) => ({
                                                ...prevState,
                                                type: "Poll",
                                            }))
                                        }
                                    >
                                        Poll Type
                                    </button>
                                </div>
                                <div className="createQuiz-btn-section">
                                    <button
                                        className="btn-green btn "
                                        onClick={quizNameTypeSubmitHandler}
                                    >
                                        Continue
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setShowCreateQuiz(false);
                                            setShowQuizNameTypePanel(true);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}

                        {/* quiz ques panel */}
                        {showQuizQuesPanel && (
                            <>
                                <form
                                    className="quiz"
                                    onSubmit={createQuizSubmitHandler}
                                    
                                >
                                    {/* ques no section */}
                                    <div className="quiz-first-section">
                                        <div className="quiz-ques-count-section">
                                            {Array.from(
                                                { length: inputData.length },
                                                (_, index) => (
                                                    <div
                                                        className="ques"
                                                        key={index}
                                                    >
                                                        <div
                                                            className={`quiz-ques-count ${
                                                                selectedQuesNo ===
                                                                    index &&
                                                                "quiz-ques-count-selected"
                                                            }`}
                                                            key={index}
                                                            onClick={() =>
                                                                setSelectedQuesNo(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        {index !== 0 && (
                                                            <div
                                                                className="quiz-ques-count-crossIcon"
                                                                onClick={() =>
                                                                    removeQuestionHandler(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <CrossIcon />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                            {inputData.length < 5 && (
                                                <div
                                                    onClick={addQuestionHandler}
                                                >
                                                    <PlusIcon />
                                                </div>
                                            )}
                                        </div>
                                        <div className="">Max 5 Questions</div>
                                    </div>

                                    {/* question */}
                                    <input
                                        className="quiz-question"
                                        type="text"
                                        placeholder="Question"
                                        value={
                                            inputData[selectedQuesNo]?.question
                                        }
                                        onChange={(e) =>
                                            setInputDataHandler(
                                                "question",
                                                e.target.value,
                                                selectedQuesNo
                                            )
                                        }
                                    />

                                    {/* option type */}
                                    <div className="quiz-optionType-section">
                                        <p>Option Type: </p>
                                        <div>
                                            <input
                                                type="radio"
                                                name="optionType"
                                                id="text"
                                                value="text"
                                                onChange={(e) =>
                                                    setInputDataHandler(
                                                        "optionType",
                                                        e.target.value,
                                                        selectedQuesNo
                                                    )
                                                }
                                                checked={
                                                    inputData[selectedQuesNo]
                                                        ?.optionType === "text"
                                                }
                                            />
                                            <label htmlFor="text">Text</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="optionType"
                                                id="imageURL"
                                                value="imageURL"
                                                onChange={(e) =>
                                                    setInputDataHandler(
                                                        "optionType",
                                                        e.target.value,
                                                        selectedQuesNo
                                                    )
                                                }
                                                checked={
                                                    inputData[selectedQuesNo]
                                                        ?.optionType ===
                                                    "imageURL"
                                                }
                                            />
                                            <label htmlFor="imageURL">
                                                Image URL
                                            </label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="optionType"
                                                id="textandImageURL"
                                                value="textandImageURL"
                                                onChange={(e) =>
                                                    setInputDataHandler(
                                                        "optionType",
                                                        e.target.value,
                                                        selectedQuesNo
                                                    )
                                                }
                                                checked={
                                                    inputData[selectedQuesNo]
                                                        ?.optionType ===
                                                    "textandImageURL"
                                                }
                                            />
                                            <label htmlFor="textandImageURL">
                                                Text and ImageURL
                                            </label>
                                        </div>
                                    </div>

                                    {/* options */}
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
                                                        id={`option${
                                                            index + 1
                                                        }`}
                                                        onChange={() =>
                                                            setInputDataHandler(
                                                                "correctOption",
                                                                index,
                                                                selectedQuesNo
                                                            )
                                                        }
                                                        checked={
                                                            inputData[
                                                                selectedQuesNo
                                                            ]?.correctOption ===
                                                            index
                                                        }
                                                    />
                                                    {(inputData[selectedQuesNo]
                                                        ?.optionType ===
                                                        "text" ||
                                                        inputData[
                                                            selectedQuesNo
                                                        ]?.optionType ===
                                                            "textandImageURL") && (
                                                        <input
                                                            type="text"
                                                            name=""
                                                            id={`option${
                                                                index + 1
                                                            }`}
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
                                                                    e.target
                                                                        .value,
                                                                    selectedQuesNo,
                                                                    index,
                                                                    "text"
                                                                )
                                                            }
                                                            value={
                                                                inputData[
                                                                    selectedQuesNo
                                                                ]?.options[
                                                                    index
                                                                ].text
                                                            }
                                                        />
                                                    )}
                                                    {(inputData[selectedQuesNo]
                                                        ?.optionType ===
                                                        "imageURL" ||
                                                        inputData[
                                                            selectedQuesNo
                                                        ]?.optionType ===
                                                            "textandImageURL") && (
                                                        <input
                                                            type="text"
                                                            name=""
                                                            id={`option${
                                                                index + 1
                                                            }`}
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
                                                                    e.target
                                                                        .value,
                                                                    selectedQuesNo,
                                                                    index,
                                                                    "imageURL"
                                                                )
                                                            }
                                                            value={
                                                                inputData[
                                                                    selectedQuesNo
                                                                ]?.options[
                                                                    index
                                                                ].imageURL
                                                            }
                                                        />
                                                    )}
                                                    {index > 1 && (
                                                        <div
                                                            className="quiz-option-delete"
                                                            onClick={() =>
                                                                deleteOptionHandler(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                        <div
                                            className="btn quiz-option quiz-add-option-btn"
                                            onClick={addOptionHandler}
                                            disabled={
                                                inputData[selectedQuesNo]
                                                    ?.options.length >= 4
                                            }
                                        >
                                            Add Option
                                        </div>
                                    </div>

                                    {/* timer */}
                                    {quizData.type === "Q & A" && (
                                        <div className="timer-type-section">
                                            <p>Timer Type: </p>
                                            <div className={`btn ${timer === 5 && "bg-red"}`} onClick={() => setTimer(5)}> 5 sec</div>
                                            <div className={`btn ${timer === 10 && "bg-red"}`} onClick={() => setTimer(10)}> 10 sec</div>
                                            <div className={`btn ${timer === "off" && "bg-red"}`} onClick={() => setTimer("off")}> Off</div>
                                            
                                        </div>
                                    )}

                                    {/* btn section */}
                                    <div className="quiz-btn-section">
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                setShowCreateQuiz(false);
                                                setShowQuizQuesPanel(false);
                                                setShowQuizNameTypePanel(true);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <input
                                            type="submit"
                                            value={`${
                                                loading
                                                    ? "Creating.."
                                                    : "Create Quiz"
                                            }`}
                                            className="btn btn-green"
                                            onSubmit={createQuizSubmitHandler}
                                            disabled={loading}
                                        />
                                    </div>
                                </form>
                            </>
                        )}

                        {/* success panel */}
                        {showCreateQuizSuccessPanel && (
                            <>
                                <div className="c-success-title">
                                    Congrats your Quiz is Published!
                                </div>
                                <input
                                    type="text"
                                    className="c-shareLink"
                                    value={quizLink}
                                />

                                {/* btn section */}
                                <div className="quiz-btn-section">
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setShowCreateQuiz(false);
                                            setShowCreateQuizSuccessPanel(
                                                false
                                            );
                                            setShowQuizNameTypePanel(true);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn bg-green"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                quizLink
                                            );
                                            toast.success(
                                                "Link copied to clipboard!"
                                            );
                                        }}
                                    >
                                        Share
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateQuiz;
