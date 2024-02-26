import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
    const user = Cookies.get('userId');
    const navigate = useNavigate();
    console.log(user);
    console.log(`http://localhost:5000/admin/${user}`);

    fetch(`http://localhost:5000/admin/${user}`)
        .then(res => res.json())
        .then(data => {
            if (data.role !== 'admin'){
                return navigate(-1);
            }
        });
    return children;
};

export default RequireAdmin;
