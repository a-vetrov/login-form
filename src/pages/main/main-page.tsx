import React from 'react';
import { Link } from "react-router-dom";

export const MainPage = () => {
    return (
        <>
            <h1>Main page</h1>
            <ul>
                <li>
                    <Link to='/login'>Login</Link>
                </li>
                <li>
                    <Link to='/register'>Register</Link>
                </li>
            </ul>
        </>
    );
};
