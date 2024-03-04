import { Link } from "react-router-dom";

const Admin = () => {
    return (
        <div className="text-left mt-6 ml-6">
            <Link to='/addbus' className="bg-red-500 text-xl text-white font-bold py-2 px-4 rounded">Add Driver </Link>
            <Link to='/addroute' className="bg-red-500 text-xl text-white font-bold ml-6 py-2 px-4 rounded">Add Route </Link>
        </div>
    );
};

export default Admin;