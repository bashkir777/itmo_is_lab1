import React, { useState, useEffect } from 'react';
import styles from '../../../../css/SpaceMarinesTable.module.css';
import { ADD_MARINE_TO_ORDEN, SPACE_MARINE_WITHOUT_ORDEN } from "../../../../tools/consts";
import { useDispatch } from "react-redux";
import { getUserInfoFromToken } from "../../../../tools/functions";
import { MDBBtn } from "mdb-react-ui-kit";

const ShortSpaceMarineTable = ({ ordenId, refresh, handleRefresh }) => {
    const [spaceMarines, setSpaceMarines] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const fetchSpaceMarines = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${SPACE_MARINE_WITHOUT_ORDEN}?page=${page}&size=10`);
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

    const addSpaceMarineHandler = (marineId) => {
        fetch(`${ADD_MARINE_TO_ORDEN}`, {
            method: 'POST',
            body: JSON.stringify({ spaceMarineId: marineId, ordenId: ordenId }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                console.log("Marine successfully added to orden");
                handleRefresh(); // Обновляем список после добавления
            }
        }).catch(error => console.error('Error adding space marine to orden:', error));
    };

    useEffect(() => {
        fetchSpaceMarines(currentPage);
    }, [currentPage, refresh]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const userInfo = getUserInfoFromToken();

    return (
        <div className={styles.tableContainer}>
            <h2 className="text-center" style={{ marginBottom: '3%' }}>Free Space Marines</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.spaceMarinesTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Chapter Name</th>
                            <th className="text-center">Chapter World</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {spaceMarines.length === 0 ? (
                            <tr>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                            </tr>
                        ) : (
                            spaceMarines.map(marine => {
                                const canAdd = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === marine.createdBy);

                                return (
                                    <tr key={marine.id}>
                                        <td className="text-center">{marine.id}</td>
                                        <td className="text-center">{marine.name.substring(0, 15) + (marine.name.length >= 15 ? "..." : '')}</td>
                                        <td className="text-center">{marine.category}</td>
                                        <td className="text-center">{marine.chapterName.substring(0, 15) + (marine.chapterName.length >= 15 ? "..." : '')}</td>
                                        <td className="text-center">{marine.chapterWorld.substring(0, 15) + (marine.chapterWorld.length >= 15 ? "..." : '')}</td>
                                        <td className="text-center">
                                            {canAdd && (
                                                <MDBBtn onClick={() => {
                                                    addSpaceMarineHandler(marine.id);
                                                }} style={{ color: "white" }} color="success">Add</MDBBtn>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
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
    );
};

export default ShortSpaceMarineTable;