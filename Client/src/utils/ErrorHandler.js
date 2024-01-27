import toast from "react-hot-toast";


const ErrorHandler = (error) => {
    console.log(error);
    if (error.response?.status == 401) {
        window.history.pushState({},'', '/');
        const popStateEvent = new PopStateEvent('popstate', { state: { path: '/' } });
        window.dispatchEvent(popStateEvent);
    }
    if (error.message == "Network Error") {
        toast.error(
            "Network Error, Could not connect to server, please try again later."
        );
        //toast.error(error.message)
       
    } else{
        toast.error(error.response?.data?.message || "Internal Server Error");
    }
};

export default ErrorHandler;
