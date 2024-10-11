import React from 'react';
import './Login.css';
import { FaRegUser } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa";


const Login = () => {
  return (
    <div className='wrapper'>
      <form action="">
        <h1>Login Page</h1>
        <div className="input-box">
          <input type="text" placeholder='Username' required />
          <FaRegUser className='icon'/>
        </div>
        <div className="input-box">
          <input type="password" placeholder='Password' required />
          <FaBullseye className='icon'/>
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox" />Remember Me </label>
          <br />
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </form>
      </div>
  )
}

export default Login