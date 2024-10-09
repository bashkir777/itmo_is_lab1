import React from 'react';
import {MDBBtn} from "mdb-react-ui-kit";
import {LOGOUT_URL, Pages} from "../../../tools/consts";
import  "../../../css/main.css"
import {useDispatch} from "react-redux";
import {
    setAccessToken, setAuthenticated, setError, setErrorMessage,
    setRefreshToken, setRole, setSuccess, setSuccessMessage
} from "../../../redux/actions";

const Logout = ({setPage}) => {

    const dispatch = useDispatch();

    const logoutHandler = () => {
        let refreshToken = localStorage.getItem("refreshToken");
        if(refreshToken === null || refreshToken === undefined){
            dispatch(setError(true));
            dispatch(setErrorMessage('Вы не вошли в аккаунт'));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }
        fetch(LOGOUT_URL, {
            method: "POST",
            body: JSON.stringify({
                "refreshToken": refreshToken
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
            .then(data => {
                dispatch(setSuccess(true));
                dispatch(setSuccessMessage('Вы успешно вышли из аккаунта.'));
                setTimeout(() => {
                    dispatch(setSuccess(false));
                    dispatch(setSuccessMessage(""));
                }, 3000);
                setPage(Pages.Login);
            }).finally(() => {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            dispatch(setAccessToken(''));
            dispatch(setRefreshToken(''));
            dispatch(setAuthenticated(false));
            dispatch(setRole(''));
        })


    }

    return (
        <>
            <MDBBtn outline onClick={logoutHandler}
                    className="btn btn-outline-dark btn-lg px-5"
                    type="submit">Выйти</MDBBtn>
        </>
    );
};

export default Logout;