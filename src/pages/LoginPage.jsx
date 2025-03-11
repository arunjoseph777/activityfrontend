import React, { useState } from "react";
import { useNavigate,useLocation, Link } from "react-router-dom";
import ApiService from "../services/ApiService"
import '../style/LoginPage.css';
import { FaGoogle } from "react-icons/fa";


const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!email || !password){
      setError('Please fill all fields.')
      setTimeout(()=> setError(''), 5000)
      return
    }

    try{
      const response = await ApiService.loginUser({email, password})

      if(response.statusCode === 200){
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.role)
        navigate(from, { replace: true })
      }
    }
    catch(error){
      setError(error.response?.data?.message || error.message)
      setTimeout(()=> setError(''), 5000)
    }
  }


  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light logbg">
      <div className="card p-4 shadow w-50">
      {error && <div className="register-notification-error">{error}</div> }
      <Link to='/home' className="text-decoration-none">
      <h1 className="text-center">Trak.</h1></Link>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                placeholder="Email"
                className="form-control"
              />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="form-control"
            />
        </div>
        <button className="btn btn-primary mt-2" type="submit">Login</button>
        <p className="text-center mt-3">
            <Link to="/register">Register Page</Link>
          </p>
      </form>
      </div>

    </div>
    
  )
}
export default LoginPage;