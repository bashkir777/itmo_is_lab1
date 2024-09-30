import {MDBInput, MDBBtn} from 'mdb-react-ui-kit';
import {Authentication, LOGIN_URL, Pages} from "../../../tools/consts";
import {
    setAccessToken,
    setAuthenticated,
    setError,
    setErrorMessage,
    setRefreshToken,
    setRole
} from "../../../redux/actions";
import {useDispatch} from "react-redux";
import {useState} from "react";

const LoginForm = ({setAuthentication, setPage}) => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const setPassword = (newPassword) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                password: newPassword
            };
        })
    }

    const setUsername = (newUsername) => {
        setUserData((prevState) => {
            return {
                ...prevState,
                username: newUsername
            };
        })
    }
    const loginHandler = () => {
        fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status !== 200) {
                dispatch(setError(true))
                const errorMessage = 'Неправильное имя пользователя или пароль. Пожалуйста попробуйте снова.';
                dispatch(setErrorMessage(errorMessage));
                throw new Error(errorMessage);
            }
            return response.json();
        }).then(data => {
            setPage(Pages.Account);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("role", data.role);
            dispatch(setAccessToken(data.accessToken))
            dispatch(setRefreshToken(data.refreshToken))
            dispatch(setAuthenticated(true))
            dispatch(setRole(data.role))
        })
    }

    const isPhone = window.innerWidth < 768;

    const userClasses = "mb-md-5 mt-md-4" + isPhone ? "pb-4" : "pb-3";

    return (
        <div className="container py-4 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-light text-dark" style={{borderRadius: "1rem", width: '100%'}}>
                        <div className={`card-body text-center p-5 pb-4`}>

                            <div className={userClasses}>

                                <h2 className="fw-bold mb-2 text-uppercase">Войти</h2>
                                <p className={`text-dark-50 ${isPhone ? "mb-4" : "mb-5"}`}>Пожалуйста, введите своё
                                    имя пользователя и пароль!</p>

                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setUsername(event.target.value)} type="text"
                                              id="typeEmailX" label="Имя пользователя"
                                              className="form-control form-control-lg"/>
                                </div>
                                <div className="form-outline form-dark mb-4">
                                    <MDBInput onChange={(event) => setPassword(event.target.value)} type="password"
                                              id="typePasswordX" label="Пароль"
                                              className="form-control form-control-lg"/>
                                </div>

                                <MDBBtn outline onClick={loginHandler}
                                        className={`btn btn-outline-dark btn-lg px-5 ${!isPhone && "mb-3 mt-4"} `}
                                        type="submit">Войти</MDBBtn>
                            </div>

                            <div>
                                <p className={`mb-0 ${isPhone && "fs-6"}`}>Еще нет аккаунта? <a href="#!"
                                                                                                onClick={(event) => {
                                                                                                    event.preventDefault();
                                                                                                    setAuthentication(Authentication.Register);
                                                                                                }}
                                                                                                className="text-dark-50 fs-6">Регистрация</a>
                                </p></div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;