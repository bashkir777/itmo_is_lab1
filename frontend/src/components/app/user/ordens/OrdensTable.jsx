import React, { useState, useEffect } from 'react';
import styles from '../../../../css/OrdensTable.module.css';
import { ORDENS_INFO_URL, ORDENS_URL } from "../../../../tools/consts";
import {useDispatch, useSelector} from "react-redux";
import { setError, setErrorMessage } from "../../../../redux/actions";
import { MDBBtn } from 'mdb-react-ui-kit';
import {selectAuthenticated} from "../../../../redux/selectors";
import OrdenForm from "./OrdenForm";
import {getUserInfoFromToken} from "../../../../tools/functions";
import ModifyOrden from "./ModifyOrden";

const OrdensTable = () => {
    const [ordens, setOrdens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [initOrden, setInitOrden] = useState({id: '', title: ''});
    const [showModifyOrden , setShowModifyOrden] = useState(false);
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
                setTimeout(() => {
                    dispatch(setError(false));
                    dispatch(setErrorMessage(""));
                }, 3000);
            } else {
                handleRefresh();
            }
        });
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
                <OrdenForm
                    close={() => setShowCreateForm(false)}
                    handleRefresh={handleRefresh}
                />
            )}
            {
                showModifyOrden
                && <ModifyOrden ordenId={initOrden.id} close={()=>setShowModifyOrden(false)}/>
            }
            {showEditForm &&(
                <OrdenForm
                    close={() => setShowEditForm(false)}
                    init={initOrden}
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
                                                    setShowEditForm(true);
                                                    setInitOrden(orden);
                                                }} color="warning">Edit</MDBBtn>
                                            )}
                                            {canDelete && (
                                                <MDBBtn className="ms-1" onClick={() => handleDelete(orden.id)} color="danger">Delete</MDBBtn>
                                            )}
                                            <MDBBtn className="ms-1" onClick={() => {
                                                setInitOrden(orden);
                                                setShowModifyOrden(true);
                                            }} color="success">Soldiers</MDBBtn>
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