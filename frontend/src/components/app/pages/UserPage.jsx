import React, {useState} from 'react';

import AuthenticationProvider from "../../auth/providers/AuthenticationProvider";
import {Pages} from "../../../tools/consts";
import Navbar from "../user/Navbar";
import Logout from "../../auth/forms/Logout";
import {useSelector} from "react-redux";
import {selectAuthenticated} from "../../../redux/selectors";
import CreateSpaceMarinePage from "./CreateSpaceMarinePage";
import SpaceMarineTable from "../user/SpaceMarineTable";


const UserPage = () => {
    const isAuthenticated = useSelector(selectAuthenticated);
    const [page, setPage] = useState(isAuthenticated ? Pages.Account : Pages.Login);

    return (
        <>
            <Navbar currentPage={page} setPage={setPage} />
            {
                page === Pages.Login &&
                <AuthenticationProvider setPage={setPage}/>
            }
            {
                page === Pages.Account &&
                <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems: 'center'}}>
                    <Logout setPage={setPage}/>
                </div>

            }
            {
                page === Pages.List &&
                <SpaceMarineTable />
            }

            {
                page === Pages.CreateSpaceMarine && <CreateSpaceMarinePage/>
            }

        </>
    );
};

export default UserPage;