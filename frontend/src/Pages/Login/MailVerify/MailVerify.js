import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const MailVerify = () => {
    const { userId } = useParams();
    useEffect( () =>{
        const url = `http://localhost:5000/mailverify/${userId}`;
        // console.log(url)
        const response = fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify()
        });
    }, []);
    
    return (
        <div className='w-2/4 bg-red-500 mx-auto my-10 py-5 rounded'>
            <p className="text-white text-4xl font-bold">Your Mail Has Been Verified</p>
            <div className="mt-4">
                <Link className="bg-red-400 hover:bg-red-700 text-xl text-white font-bold py-2 px-4 rounded" to="/login">LOGIN</Link>
            </div>
        </div>
    );
};

export default MailVerify;