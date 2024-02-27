import CustomLink from "../CustomLink/CustomLink";
import { useLocation } from "react-router-dom";

const Header = () => {
    let location = useLocation();
    return (
        <div>
            <nav className="w-full bg-red-500 p-2">
                <div className="flex items-center justify-between">
                    <CustomLink to="/home">
                        Bus Ticketing System
                    </CustomLink>
                    <CustomLink to="/admin">
                        Admin
                    </CustomLink>
                    {
                        location.pathname !== "/login" ?
                        <button className='font-bold text-2xl p-1 text-white'>LOGOUT</button>
                        :
                        <CustomLink to="/login">LOGIN</CustomLink>
                    }
                </div>
            </nav>
        </div>
    );
};

export default Header;