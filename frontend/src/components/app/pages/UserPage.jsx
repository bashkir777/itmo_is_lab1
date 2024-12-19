import React, {useState} from 'react';

import AuthenticationProvider from "../../auth/providers/AuthenticationProvider";
import {Pages} from "../../../tools/consts";
import Navbar from "../user/Navbar";
import {useSelector} from "react-redux";
import {selectAuthenticated} from "../../../redux/selectors";
import CreateSpaceMarinePage from "./CreateSpaceMarinePage";
import SpaceMarineTable from "../user/space-marines/SpaceMarineTable";
import AdminApplications from "../user/applications/AdminApplications";
import UserAccountInfoPage from "./UserAccountInfoPage";
import OrdensTable from "../user/ordens/OrdensTable";
import AdditionalWrapper from "../user/additional/AdditionalWrapper";
import InfiniteCoordinates from "../user/visualization/InfiniteCoordinates";
import Import from "../user/import/Import";


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
                <UserAccountInfoPage setPage={setPage}/>
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

            {
                page === Pages.Additional && <AdditionalWrapper/>
            }

            {
                page === Pages.Visualization && <InfiniteCoordinates/>
            }

            {
                page === Pages.Import && <Import/>
            }

        </>
    );
};

export default UserPage;