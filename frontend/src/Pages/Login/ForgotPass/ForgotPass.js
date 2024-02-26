import { useRef } from "react";

const ForgotPass = () => {
    const emailRef = useRef('');

    const handleForgotPass = async event => {
        event.preventDefault();
        const email = emailRef.current.value;

        const user = { email };

        const url = "http://localhost:5000/forgotpass";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        // if (response.ok) {
        //     console.log("done")
        // } else {
        //     console.log("error")
        //   }
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Forgot Password</h1>

            <form onSubmit={handleForgotPass}>
                <div className="mb-4">
                    <input
                        ref={emailRef}
                        type="email"
                        id="email"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your email"
                        required
                    />
                </div> 

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Send Mail
                </button>
            </form>
        </div>
    );
};

export default ForgotPass;