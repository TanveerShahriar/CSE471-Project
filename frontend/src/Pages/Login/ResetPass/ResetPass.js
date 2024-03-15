import { useRef } from "react";
import { useParams } from "react-router-dom";

const Home = () => {
    const { userId } = useParams();
    const passwordRef = useRef('');

    const handleResetPass = async event => {
        event.preventDefault();
        const password = passwordRef.current.value;

        const url = `http://localhost:5000/resetpass/${userId}`;
        console.log(url)
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Reset Password</h1>

            <form onSubmit={handleResetPass}>
                <div className="mb-4">
                    <input
                        ref={passwordRef}
                        type="password"
                        id="password"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your new password"
                        required
                    />
                </div> 

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Reset
                </button>
            </form>
        </div>
    );
};

export default Home;