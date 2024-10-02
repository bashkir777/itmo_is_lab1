import React, { useState, useEffect } from 'react';
import styles from '../../../css/SpaceMarinesTable.module.css';
import { SPACE_MARINES_INFO_URL } from "../../../tools/consts";
import {useDispatch} from "react-redux";
import {setError, setErrorMessage} from "../../../redux/actions";
import PatchSpaceMarinePage from "../pages/PatchSpaceMarinePage";

const SPACE_MARINES_URL = '/api/v1/space-marines';

const SpaceMarineTable = () => {
    const [spaceMarines, setSpaceMarines] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const fetchSpaceMarines = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${SPACE_MARINES_INFO_URL}?page=${page}&size=10`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSpaceMarines(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching space marines:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaceMarines(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRefresh = () => {
        fetchSpaceMarines(currentPage);
    };

    const[showPatchForm, setShowPatchForm] = useState(false);

    const handleDelete = async (id) => {
        fetch(`${SPACE_MARINES_URL}/${id}`,
            {method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}}).
        then((response) => {
            if (!response.ok) {
                dispatch(setError(true));
                dispatch(setErrorMessage("Не удалось удалить объект. Повторите попытку позже"))
            }else{
                handleRefresh();
            }

        })
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

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        health: '',
        category: '',
        weaponType: '',
        meleeWeapon: '',
        existingChapterId: '',
        existingCoordinateId: '',
    });

    return (
        <>
            {showPatchForm && <PatchSpaceMarinePage initialData={formData} close={()=> {
                setShowPatchForm(false);
                handleRefresh();
            }} />}
        <div className={styles.tableContainer}>
            <h2 className="text-center">Space Marines</h2>
            <button onClick={handleRefresh} className={styles.refreshButton}>Refresh</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.spaceMarinesTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Health</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Weapon Type</th>
                            <th className="text-center">Melee Weapon</th>
                            <th className="text-center">Chapter Name</th>
                            <th className="text-center">Chapter World</th>
                            <th className="text-center">Coordinates (X, Y)</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {spaceMarines.map(marine => {
                            const canEdit = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === marine.createdBy);
                            const canDelete = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === marine.createdBy);

                            return (
                                <tr key={marine.id}>
                                    <td className="text-center">{marine.id}</td>
                                    <td className="text-center">{marine.name.substring(0, 15) + (marine.name.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.health}</td>
                                    <td className="text-center">{marine.category}</td>
                                    <td className="text-center">{marine.weaponType}</td>
                                    <td className="text-center">{marine.meleeWeapon}</td>
                                    <td className="text-center">{marine.chapterName.substring(0, 15) + (marine.chapterName.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.chapterWorld.substring(0, 15) + (marine.chapterWorld.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.x}, {marine.y}</td>
                                    <td className="text-center">
                                        {canEdit && (
                                            <button onClick={() => {
                                                setFormData(marine);
                                                setShowPatchForm(true);
                                            }} className={styles.actionButton} style={{ backgroundColor: "#ff8000" }}>Edit</button>
                                        )}
                                        {canDelete && (
                                            <button onClick={() => handleDelete(marine.id)} className={styles.actionButton} style={{ backgroundColor: "#ff0000" }}>Delete</button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`${currentPage === page ? styles.active : ''}`}
                                style={{ borderRadius: '6px' }}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
        </>
    );
};

export default SpaceMarineTable;