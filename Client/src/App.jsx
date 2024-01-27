import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import Analytics from './pages/Analytics/Analytics'
import QuestionAnalysis from './pages/QuestionAnalysis/QuestionAnalysis';
import Quiz from './pages/Quiz/Quiz';
import Success from './pages/Success/Success'
function App() {

  return (
    <>
    <div className="app">
      <BrowserRouter>
      <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
                background: "#F5F2F2",
            },
            success: {  
              icon: "✅",
            },
            error: {
              icon: "❌",
            },
          }}
        />
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/analytics/:id" element={<QuestionAnalysis/>}/>
        <Route path="/quiz/success" element={<Success/>}/>
        <Route path="/quiz/:id" element={<Quiz/>}/>
      </Routes>
      </BrowserRouter>
    </div>
      
    </>
  )
}

export default App
