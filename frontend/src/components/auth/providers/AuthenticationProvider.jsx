import React, {useState} from 'react';
import {Authentication} from "../../../tools/consts";

import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";

const AuthenticationProvider = ({setPage}) => {
    const [authentication, setAuthentication] = useState(Authentication.Login);

    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const isPhone = window.innerWidth < 768;
    const backgroundStyle = {
        backgroundImage:  backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: isPhone ? '96vh' : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };


    return (
        <span style={backgroundStyle}>
            {authentication === Authentication.Login
                && <LoginForm setPage={setPage} setAuthentication={setAuthentication}
                />}
            {authentication === Authentication.Register
                && <RegisterForm setAuthentication={setAuthentication} mode={"register"}
                />}
            {
                authentication === Authentication.AdminRegister
                && <RegisterForm setAuthentication={setAuthentication} mode={"admin-application"}
                />
            }
        </span>
    );
};

export default AuthenticationProvider;