import { useParams } from "react-router-dom";

const Verify = () => {
    const { userId } = useParams();

    const handleResend = async event => {
        const url = `http://localhost:5000/resend`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ userId})
        });
    }
    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <div className="text-white text-4xl font-bold">
                <p>Check Your Email</p>
                <p>Click The Link To Verify Your Email</p>
            </div>

            <button onClick={handleResend} className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold mt-4 py-4 px-4 rounded">
                    Resend Verification Mail
            </button>
        </div>
    );
};

export default Verify;