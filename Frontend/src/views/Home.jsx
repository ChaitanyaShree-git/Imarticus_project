import { useNavigate } from 'react-router-dom'

export default function Home(){
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to Movies Review Site</h1>
            <button onClick={()=>navigate('/login')}>Login</button>
            <button onClick={() =>navigate('/Signup')}>Signup</button>
        </div>
    )
}