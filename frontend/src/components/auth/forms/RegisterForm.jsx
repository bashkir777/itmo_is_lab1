import React, {useState} from 'react';
import {MDBBtn, MDBInput} from "mdb-react-ui-kit";
import {Authentication, REGISTER_URL, ADMIN_APPLICATION_URL} from "../../../tools/consts";
import {useDispatch} from "react-redux";
import {setError, setErrorMessage, setSuccess, setSuccessMessage} from "../../../redux/actions";

const RegisterForm = ({setAuthentication, mode}) => {

    const dispatch = useDispatch();

    const isPhone = window.innerWidth < 768;

    const [userData, setUserData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: ''
    });

    const setUsername = (newUsername) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                username: newUsername
            }
        })
    }

    const setPassword = (newPassword) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                password: newPassword
            }
        })
    }

    const setFirstname = (newFirstname) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                firstname: newFirstname
            }
        })
    }

    const setLastname = (newLastname) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                lastname: newLastname
            }
        })
    }

    const nextHandler = async () => {
        if (userData.username.length === 0 || userData.password.length === 0
            || userData.firstname.length === 0 || userData.lastname.length === 0) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Пожалуйста заполните все поля формы"));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }
        if (userData.password.length < 7) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Пароль слишком короткий. Пожалуйста, придумайте другой пароль."));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }
        if (userData.firstname.length < 7) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Имя слишком короткое. Пожалуйста, введите свое полное имя."));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }
        if (userData.lastname.length < 7) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Фамилия слишком короткая. Пожалуйста, введите свою фамилию."));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }
        if (userData.username.length < 7) {
            dispatch(setError(true));
            dispatch(setErrorMessage("Имя пользователя слишком короткое. Пожалуйста, придумайте другое."));
            setTimeout(() => {
                dispatch(setError(false));
                dispatch(setErrorMessage(""));
            }, 3000);
            return;
        }

        const url = mode === 'register' ? REGISTER_URL : ADMIN_APPLICATION_URL;

        fetch(url, {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                dispatch(setError(true));
                dispatch(setErrorMessage("Это имя пользователя уже занято. Пожалуйста, придумайте другое."));
                setTimeout(() => {
                    dispatch(setError(false));
                    dispatch(setErrorMessage(""));
                }, 3000);
            }
        })
            .then(data => {
                if (data.success) {
                    dispatch(setSuccess(true));
                    if (mode === 'register') {
                        dispatch(setSuccessMessage("Вы были успешно зарегистрированы. Пожалуйста, войдите в аккаунт"));
                        setTimeout(() => {
                            dispatch(setSuccess(false));
                            dispatch(setSuccessMessage(""));
                        }, 3000);
                    } else {
                        dispatch(setSuccessMessage("Заявка была создана и отправлена на рассмотрение. Чтобы отслеживать ее статус, войдите в приложение."));
                        setTimeout(() => {
                            dispatch(setSuccess(false));
                            dispatch(setSuccessMessage(""));
                        }, 3000);
                    }
                    setAuthentication(Authentication.Login);
                } else {
                    dispatch(setError(true));
                    dispatch(setErrorMessage(data.description));
                }
            })
    }

    return (
        <div className="container pt-3 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-light text-dark" style={{borderRadius: "1rem"}}>
                        <div className={`card-body p-5 text-center pb-4`}>

                            <div className="my-md-4 pb-2">

                                <h2 className="fw-bold mb-2 text-uppercase">
                                    {mode === 'register' ? 'Регистрация' : 'Получить статуса администратора'}
                                </h2>
                                <p className="text-dark-50 mb-4">Пожалуйста, заполните форму!</p>

                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setUsername(event.target.value)} type="text"
                                              id="typeUsernameX" label="Имя пользователя"
                                              className="form-control form-control-lg"/>
                                </div>
                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setPassword(event.target.value)}
                                              type="password" id="typePasswordX" label="Пароль"
                                              className="form-control form-control-lg"/>
                                </div>
                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setFirstname(event.target.value)} type="text"
                                              id="typeFirstnameX" label="Имя"
                                              className="form-control form-control-lg"/>
                                </div>
                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setLastname(event.target.value)} type="text"
                                              id="typeLastnameX" label="Фамилия"
                                              className="form-control form-control-lg"/>
                                </div>

                                <MDBBtn outline className="btn btn-outline-dark btn-lg px-5 mt-3"
                                        type="submit" onClick={nextHandler}>{mode === 'register' ? 'Далее' : 'Отправить заявку'}</MDBBtn>
                            </div>
                            <div className={`${isPhone && "mt-3"}`}>
                                <p className="mb-0">Хотите вернуться назад? <a href="#!"
                                                                               onClick={(event) => {
                                                                                   event.preventDefault();
                                                                                   setAuthentication(Authentication.Login);
                                                                               }}
                                                                               className="text-dark-50">Назад</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;