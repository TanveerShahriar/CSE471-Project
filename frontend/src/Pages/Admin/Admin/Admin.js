import { Link } from "react-router-dom";

const Admin = () => {
    return (
        <div className="text-left mt-6 ml-6">
            <Link to='/addbus' className="bg-red-500 text-xl text-white font-bold py-2 px-4 rounded">Add Bus </Link>
            <Link to='/addroute' className="bg-red-500 text-xl text-white font-bold ml-6 py-2 px-4 rounded">Add Route </Link>
            <Link to='/addschedule' className="bg-red-500 text-xl text-white font-bold ml-6 py-2 px-4 rounded">Add Schedule </Link>
            <Link to='/dailyschedule' className="bg-red-500 text-xl text-white font-bold ml-6 py-2 px-4 rounded">Daily Schedule </Link>
            <Link to='/createaccount' className="bg-red-500 text-xl text-white font-bold ml-6 py-2 px-4 rounded">Create Account </Link>
        </div>
    );
};

export default Admin;