import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminInfo = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const nameRef = useRef('');
    const passwordRef = useRef('');
    const mobileRef = useRef('');

    const handleDriverInfo = async event => {
        event.preventDefault();
        const name = nameRef.current.value;
        const password = passwordRef.current.value;
        const mobile = mobileRef.current.value;

        const user = { name, password, mobile };

        const url = `http://localhost:5000/admininfo/${userId}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {navigate('/login')});
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Give Your Informations</h1>

            <form onSubmit={handleDriverInfo}>
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
                        ref={passwordRef}
                        type="password"
                        id="password"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your password"
                        required
                    />

                    <input
                        ref={mobileRef}
                        type="text"
                        id="mobile"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your mobile number"
                        required
                    />
                </div> 

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Save
                </button>
            </form>
        </div>
    );
};

export default AdminInfo;