import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();

    const handleLogin = async event => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const user = { email, password };

        const url = "http://localhost:5000/login";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();

        if (data.verify === false){
            navigate(`/verify/${data.userId}`)
        }
        else if (data.otp === true) {
            if (data.role === 'admin') {
                navigate(`/admininfo/${data.userId}`)
            }
            else {
                navigate(`/driverinfo/${data.userId}`)
            }
        }
        else if (response.ok) {
            Cookies.set('userId', data.userId, { expires: 7 })
            navigate('/');
        } else {
            console.log("error")
          }
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Please Login</h1>

            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <input
                        ref={emailRef}
                        type="email"
                        id="email"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your email"
                        required
                    />

                    <input
                        ref={passwordRef}
                        type="password"
                        id="password"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your password"
                        required
                    />
                </div> 

                <div className="flex flex-row justify-between mx-8">
                    <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                        Login
                    </button>
                    <Link to="/forgotpass" className='text-white py-auto text-xl font-bold my-3'>
                        Forgot Password
                    </Link>
                </div>
            </form>

            <p className='text-xl font-bold my-3'>New to the website? <Link to="/register" className='text-white py-auto'>Please Register</Link> </p>
        </div>
    );
};

export default Login;