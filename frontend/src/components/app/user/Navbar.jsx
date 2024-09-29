import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../../css/Navbar.module.css';
import { Pages } from "../../../tools/consts";
import { selectAuthenticated } from '../../../redux/selectors';

const Navbar = ({ setPage, currentPage }) => {
    const isPhone = window.innerWidth < 768;
    const isAuthenticated = useSelector(selectAuthenticated);

    return (
        <div className={`bg-light sticky-top p-2 shadow-3-strong d-flex justify-content-between align-items-center ${isPhone ? "py-3" : ""}`}>
            {!isPhone && <div className="flex-grow-1 mx-3"></div>}

            <div className={`${isPhone ? "d-flex" : "d-inline-flex"}`}>
                <div className="px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50  ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase  ${currentPage === Pages.List ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.List);
                        }}
                    >
                        List
                    </a>
                </div>

                <div className=" px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50 ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase ${currentPage === Pages.CreateSpaceMarine ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.CreateSpaceMarine);
                        }}
                    >
                        <i className="fa-solid fa-circle-user me-1"></i> Create SpaceMarine
                    </a>
                </div>
                <div className=" px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50 ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase ${(currentPage === (isAuthenticated ? Pages.Account : Pages.Login)) ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(isAuthenticated ? Pages.Account : Pages.Login);
                        }}
                    >
                        <i className="fa-solid fa-circle-user me-1"></i> {isAuthenticated ? 'Account' : 'Sign in/up'}
                    </a>
                </div>
            </div>

            {!isPhone && <div className="flex-grow-1 mx-3"></div>}
        </div>
    );
};

export default Navbar;