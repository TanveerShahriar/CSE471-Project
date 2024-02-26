import { useRef } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const handleRegister = async event => {
        event.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const role = 'general'

        const user = { name, email, password, role };

        const url = "http://localhost:5000/register";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
            });
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Please Register</h1>

            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <input
                        ref={nameRef}
                        type="text"
                        id="name"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your name"
                        required
                    />

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

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Register
                </button>
            </form>

            <p className='text-xl font-bold my-3'>Already have an account? <Link to="/login" className='text-white py-auto'>Please Login</Link> </p>
        </div>
    );
};

export default Login;