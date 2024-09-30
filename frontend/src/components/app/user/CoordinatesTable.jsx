import React, { useState, useEffect } from 'react';
import styles from '../../../css/CoordinatesTable.module.css';

const COORDINATES_URL = '/api/v1/coordinates';

const CoordinatesTable = ({ refresh }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchCoordinates = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${COORDINATES_URL}?page=${page}&size=10`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCoordinates(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoordinates(currentPage);
    }, [currentPage, refresh]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.tableContainer}>
            <h2>Coordinates</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.coordinatesTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">X</th>
                            <th className="text-center">Y</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coordinates.map(coord => (
                            <tr key={coord.id}>
                                <td>{coord.id}</td>
                                <td>{coord.x}</td>
                                <td>{coord.y}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? styles.active : ''}
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

export default CoordinatesTable;