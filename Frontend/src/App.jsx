import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './views/login'
import axios from 'axios'
import Signup from './views/Signup'
import PrivateRoute from './components/PrivateRoute'
import Home from './views/Home'
import Dashboard from './components/Dashboard'
import MovieReviews from './components/movieReview'

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/'
                        element={
                            <Home/>
                        }
                    />
                    <Route path='/Signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={
                            <Dashboard/>
                    }></Route>
                    <Route path="/movies/:title/reviews" element={<MovieReviews />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
