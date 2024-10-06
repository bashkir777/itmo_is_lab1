import React, {useState} from 'react';

import AuthenticationProvider from "../../auth/providers/AuthenticationProvider";
import {Pages} from "../../../tools/consts";
import Navbar from "../user/Navbar";
import Logout from "../../auth/forms/Logout";
import {useSelector} from "react-redux";
import {selectAuthenticated} from "../../../redux/selectors";
import CreateSpaceMarinePage from "./CreateSpaceMarinePage";
import SpaceMarineTable from "../user/SpaceMarineTable";
import AdminApplications from "../user/AdminApplications";
import UserAccountInfo from "../user/UserAccountInfo";
import OrdensTable from "../user/OrdensTable";


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
                <UserAccountInfo setPage={setPage}/>
            }
            {
                page === Pages.List &&
                <SpaceMarineTable />
            }

            {
                page === Pages.CreateSpaceMarine && <CreateSpaceMarinePage/>
            }
            {
                page === Pages.Applications && <AdminApplications/>
            }
            {
                page === Pages.Ordens && <OrdensTable/>
            }

        </>
    );
};

export default UserPage;