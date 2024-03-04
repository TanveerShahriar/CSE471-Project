import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({children}) => {
    const user = Cookies.get('userId');
    const location = useLocation();
    if(!user){
        return <Navigate to="/login"/>;
    }
    return children;
};

export default RequireAuth;