import { useRef } from "react";

const CreateAccount = () => {
    const emailRef = useRef('');
    const roleRef = useRef('');

    const handleCreate = async event => {
        event.preventDefault();
        const email = emailRef.current.value;
        const role = roleRef.current.value.toLowerCase();

        console.log(email, role);
        const user = { email, role};

        const url = "http://localhost:5000/createaccount";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => { });
        
        event.target.reset()
    }

    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <h1 className='text-white text-center mt-2 text-4xl font-bold'>Please Register</h1>

            <form onSubmit={handleCreate}>
                <div className="mb-4">
                    <input
                        ref={emailRef}
                        type="email"
                        id="email"
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        placeholder="Enter your email"
                        required
                    />

                    <select
                        className={"shadow appearance-none border rounded w-11/12 mx-4 my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                        ref={roleRef}
                    >
                        <option>Select Account Type</option>
                        <option>Admin</option>
                        <option>Driver</option>
                    </select>
                </div> 

                <button className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded">
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreateAccount;