import React, {useEffect} from 'react';
import styles from '../../../css/UserAccountInfo.module.css';
import Logout from "../../auth/forms/Logout";
import {USER_INFO_URL} from "../../../tools/consts";
import {decodeJwtToken} from "../../../tools/functions";

const UserAccountInfoPage = ({setPage}) => {
    const [userInfo, setUserInfo] = React.useState({firstname: '', username: '', role: '', lastname: ''});

    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage:  backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '93vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    useEffect(() => {
            const accessToken = localStorage.getItem('accessToken');
            const username = decodeJwtToken(accessToken).sub;
            fetch(USER_INFO_URL + username, {headers: {'Authorization': `Bearer ${accessToken}`}}).
            then(response => {
                if (!response.ok) {
                    const message = "Не удалось получить информацию о пользователе";
                    throw new Error(message)
                } else {
                    return response.json();
                }
            }).then(data => setUserInfo(data)).catch(error => console.log(error));
        },[]);

    return (
        <div style={backgroundStyle}>
            <div className={`${styles.userAccountInfo} shadow p-4 bg-white`}>
                <h2 className="text-center mb-4">Информация о пользователе</h2>
                <table className={styles.userInfoTable}>
                    <thead>
                    <tr>
                        <th>Имя пользователя</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Роль</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{userInfo.username}</td>
                        <td>{userInfo.firstname}</td>
                        <td>{userInfo.lastname}</td>
                        <td>{userInfo.role}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="text-center mt-4">
                    <Logout setPage={setPage}/>
                </div>
            </div>
        </div>
    );
};

export default UserAccountInfoPage;