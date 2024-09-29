import React from 'react';
import { Pages } from "../../../../tools/consts";
import styles from "../../../../css/Navbar.module.css";

const Navbar = ({ setPage, currentPage }) => {
    const isPhone = window.innerWidth < 768;

    return (
        <div className={`bg-light sticky-top p-2 shadow-3-strong d-flex justify-content-between align-items-center ${isPhone ? "py-3" : ""}`}>
            <a href="" className={`d-flex align-items-center`}>
                <img
                    src="/img/argo_logo.png"
                    className={`${styles.logo}`}
                    alt="Logo"
                />
            </a>

            {!isPhone && <div className="flex-grow-1 mx-3"></div>}

            <div className={`${isPhone ? "d-flex" : "d-inline-flex"}`}>
                <div className="px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50  ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase  ${currentPage === Pages.Catalog ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.Catalog);
                        }}
                    >
                        Каталог
                    </a>
                </div>

                <div className="px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50 ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase ${currentPage === Pages.About ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.About);
                        }}
                    >
                        О нас
                    </a>
                </div>

                <div className=" px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50 ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase ${currentPage === Pages.Bucket ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.Bucket);
                        }}
                    >
                        <i className="fa-solid fa-cart-shopping me-1"></i> Корзина
                    </a>
                </div>

                <div className=" px-lg-5 flex-fill text-center d-flex align-items-center">
                    <a
                        className={`${styles.element} text-black-50 ${!isPhone && "px-4 py-2 fs-6"} ${isPhone && "px-2 py-1"} text-uppercase ${currentPage === Pages.Login ? styles.active : ''}`}
                        href=""
                        onClick={(event) => {
                            event.preventDefault();
                            setPage(Pages.Login);
                        }}
                    >
                        <i className="fa-solid fa-circle-user me-1"></i> Войти
                    </a>
                </div>
            </div>

            {!isPhone && <div className="flex-grow-1 mx-3"></div>}
        </div>
    );
};

export default Navbar;