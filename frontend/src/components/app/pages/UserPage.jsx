import React, {useState} from 'react';

import AuthenticationProvider from "../../auth/providers/AuthenticationProvider";
import {useSelector} from "react-redux";
import {selectAuthenticated} from "../../../redux/selectors";
import Logout from "../../auth/forms/Logout";


const UserPage = () => {


    const authenticated = useSelector(selectAuthenticated);
    return (
        <>
            {
                !authenticated  &&
                <AuthenticationProvider/>
            }
            {
                authenticated && <Logout/>
            }

        </>
    );
};

export default UserPage;