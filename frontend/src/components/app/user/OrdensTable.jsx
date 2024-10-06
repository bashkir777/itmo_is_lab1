import React, { useState, useEffect } from 'react';
import styles from '../../../css/OrdensTable.module.css';
import { ORDENS_INFO_URL, ORDENS_URL } from "../../../tools/consts";
import {useDispatch, useSelector} from "react-redux";
import { setError, setErrorMessage } from "../../../redux/actions";
import { MDBBtn } from 'mdb-react-ui-kit';
import CreateOrdenForm from './CreateOrdenForm';
import {selectAuthenticated} from "../../../redux/selectors";

const OrdensTable = () => {
    const [ordens, setOrdens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const dispatch = useDispatch();

    const fetchOrdens = async () => {
        setLoading(true);
        try {
            const response = await fetch(ORDENS_INFO_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrdens(data);
        } catch (error) {
            console.error('Error fetching ordens:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdens();
    }, []);

    const handleRefresh = () => {
        fetchOrdens();
    };

    const handleDelete = async (id) => {
        fetch(`${ORDENS_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }).then((response) => {
            if (!response.ok) {
                dispatch(setError(true));
                dispatch(setErrorMessage("Не удалось удалить объект. Повторите попытку позже"));
            } else {
                handleRefresh();
            }
        });
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const getUserInfoFromToken = () => {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            const decodedToken = parseJwt(token);
            return {
                username: decodedToken.sub,
                role: decodedToken.role
            };
        }
        return null;
    };

    const userInfo = getUserInfoFromToken();

    const isAuthenticated = useSelector(selectAuthenticated);
    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '94vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };



    return (
        <div style={backgroundStyle}>
            {showCreateForm &&(
                <CreateOrdenForm
                    close={() => setShowCreateForm(false)}
                    handleRefresh={handleRefresh}
                />
            )}
            <div className={styles.tableContainer}>
                <h2 className="text-center" style={{ marginBottom: '3%' }}>Ordens</h2>

                <MDBBtn onClick={handleRefresh} className={styles.refreshButton}>Refresh</MDBBtn>

                {
                    isAuthenticated &&
                    <MDBBtn onClick={() => setShowCreateForm(true)}
                            className={styles.createButton} color="success">
                        Create
                    </MDBBtn>
                }

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className={styles.ordensTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Title</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ordens.length === 0 ? (
                            <tr>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                            </tr>
                        ) : (
                            ordens.map(orden => {
                                const canEdit = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === orden.createdBy);
                                const canDelete = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === orden.createdBy);

                                return (
                                    <tr key={orden.id}>
                                        <td className="text-center">{orden.id}</td>
                                        <td className="text-center">{orden.title}</td>
                                        <td className="text-center">
                                            {canEdit && (
                                                <MDBBtn className="ms-1" onClick={() => {
                                                    // Handle edit button click
                                                }} color="warning">Edit</MDBBtn>
                                            )}
                                            {canDelete && (
                                                <MDBBtn className="ms-1" onClick={() => handleDelete(orden.id)} color="danger">Delete</MDBBtn>
                                            )}
                                            <MDBBtn className="ms-1" onClick={() => { /* Handle soldiers button click */ }} color="success">Soldiers</MDBBtn>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrdensTable;