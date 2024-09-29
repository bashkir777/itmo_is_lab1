import React, {useState} from 'react';

import AuthenticationProvider from "../../auth/providers/AuthenticationProvider";
import {Pages} from "../../../tools/consts";
import SpaceMarineForm from "../user/SpaceMarineForm";
import Navbar from "../user/Navbar";
import Logout from "../../auth/forms/Logout";
import {useSelector} from "react-redux";
import {selectAuthenticated} from "../../../redux/selectors";


const UserPage = () => {
    const isAuthenticated = useSelector(selectAuthenticated);
    const [page, setPage] = useState(isAuthenticated ? Pages.Account : Pages.Login);

    return (
        <>
            <Navbar currentPage={page} setPage={setPage} />
            {
                page === Pages.Login &&
                <AuthenticationProvider/>
            }
            {
                page === Pages.Account &&
                <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems: 'center'}}>
                    <Logout/>
                </div>

            }

            {
                page === Pages.CreateSpaceMarine && <SpaceMarineForm/>
            }

        </>
    );
};

export default UserPage;