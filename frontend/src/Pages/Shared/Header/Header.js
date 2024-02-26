import CustomLink from "../CustomLink/CustomLink";

const Header = () => {
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
                    <CustomLink to="/login">
                        Login
                    </CustomLink>
                </div>
            </nav>
        </div>
    );
};

export default Header;